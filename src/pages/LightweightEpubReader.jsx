// src/LightweightEpubReader.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import JSZip from "jszip";

export default function LightweightEpubReader({ blob, onClose }) {
  const iframeRef = useRef(null);
  const [spine, setSpine] = useState([]);
  const [manifest, setManifest] = useState({});
  const [title, setTitle] = useState("Untitled");
  const [page, setPage] = useState(1);
  const [dark, setDark] = useState(false);
  const [zip, setZip] = useState(null);
  const [fontSize, setFontSize] = useState(100); // percentage
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [copyNotification, setCopyNotification] = useState(false);
  const [viewMode, setViewMode] = useState("single"); // "single" or "spread"
  const iframeRef2 = useRef(null); // Second iframe for spread view

  // Enable text selection in iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          // Enable context menu for copy
          iframeDoc.addEventListener('contextmenu', () => {
            // Allow default context menu for text selection
            const selection = iframeDoc.getSelection();
            if (selection && selection.toString().length > 0) {
              // Show copy notification
              setCopyNotification(true);
              setTimeout(() => setCopyNotification(false), 2000);
            }
          });

          // Add copy keyboard shortcut
          iframeDoc.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
              const selection = iframeDoc.getSelection();
              if (selection && selection.toString().length > 0) {
                setCopyNotification(true);
                setTimeout(() => setCopyNotification(false), 2000);
              }
            }
          });
        }
      } catch (err) {
        console.log('Cannot access iframe content:', err);
      }
    };

    iframe.addEventListener('load', handleIframeLoad);
    return () => iframe.removeEventListener('load', handleIframeLoad);
  }, []);

  useEffect(() => {
    (async () => {
      const z = await JSZip.loadAsync(blob);
      setZip(z);

      // 1) Find OPF
      const containerXml = await z.file("META-INF/container.xml").async("text");
      const containerDoc = new DOMParser().parseFromString(containerXml, "application/xml");
      const rootfile = containerDoc.querySelector("rootfile");
      const opfPath = rootfile.getAttribute("full-path");

      // 2) Parse OPF → manifest + spine + metadata
      const opfXml = await z.file(opfPath).async("text");
      const opfDoc = new DOMParser().parseFromString(opfXml, "application/xml");
      const ns = (sel) => opfDoc.querySelector(sel);

      setTitle(ns("metadata > title, metadata dc\\:title")?.textContent || "Untitled");

      const manifestMap = {};
      opfDoc.querySelectorAll("manifest > item").forEach((it) => {
        manifestMap[it.getAttribute("href")] = {
          id: it.getAttribute("id"),
          mediaType: it.getAttribute("media-type"),
        };
      });

      const spineHrefs = [];
      opfDoc.querySelectorAll("spine > itemref").forEach((ref) => {
        const idref = ref.getAttribute("idref");
        const href = Object.keys(manifestMap).find((h) => manifestMap[h].id === idref);
        if (href) spineHrefs.push(href);
      });

      setManifest(manifestMap);
      setSpine(spineHrefs);
      setPage(spineHrefs.length > 1 ? 1 : 0);
    })();
  }, [blob]);

  const getObjectUrl = useMemo(() => {
    const cache = new Map();
    return async (pathInZip) => {
      if (cache.has(pathInZip)) return cache.get(pathInZip);
      const f = zip?.file(`OEBPS/${pathInZip}`);
      if (!f) return null;
      const mt = manifest[pathInZip]?.mediaType || "application/octet-stream";
      const arr = await f.async("arraybuffer");
      const url = URL.createObjectURL(new Blob([arr], { type: mt }));
      cache.set(pathInZip, url);
      return url;
    };
  }, [zip, manifest]);

  const normalize = (p) => p.replace(/^(\.\.\/)+/g, "").replace(/^\.\//, "");

  const displayPage = async (index) => {
    if (!zip || !spine.length) return;
    const clamped = Math.max(1, Math.min(spine.length - 1, index));
    
    // Display left page
    await displaySinglePage(clamped, iframeRef);
    
    // Display right page in spread mode
    if (viewMode === "spread" && clamped + 1 <= spine.length - 1) {
      await displaySinglePage(clamped + 1, iframeRef2);
    }
    
    setPage(clamped);
  };

  const displaySinglePage = async (index, targetIframeRef) => {
    if (!zip || !spine.length || !targetIframeRef.current) return;
    
    const href = spine[index];
    const xhtml = await zip.file(`OEBPS/${href}`).async("text");

    const doc = new DOMParser().parseFromString(xhtml, "application/xhtml+xml");

    // link stylesheet
    const links = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    for (const l of links) {
      const href = l.getAttribute("href");
      const clean = normalize(href);
      const url = await getObjectUrl(clean);
      if (url) l.setAttribute("href", url);
    }

    // images
    const imgs = Array.from(doc.querySelectorAll("img[src]"));
    for (const img of imgs) {
      const s = img.getAttribute("src");
      const clean = normalize(s);
      const url = await getObjectUrl(clean);
      if (url) img.setAttribute("src", url);
      img.setAttribute("style", "max-width:100%;height:auto;display:block;margin:0 auto;");
    }

    // Enhanced theme with font size control
    const body = doc.querySelector("body");
    if (body) {
      const baseStyle = `
        margin: 2em auto;
        max-width: 800px;
        padding: 0 2em;
        line-height: 1.8;
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: ${fontSize}%;
        user-select: text !important;
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        cursor: text;
      `;
      
      body.setAttribute(
        "style",
        dark
          ? baseStyle + "background:#1a1a2e;color:#e4e4e7;"
          : baseStyle + "background:#ffffff;color:#1f2937;"
      );
    }

    // Ensure all text elements are selectable
    const allElements = doc.querySelectorAll("*");
    allElements.forEach(el => {
      const currentStyle = el.getAttribute("style") || "";
      if (!currentStyle.includes("user-select")) {
        el.setAttribute("style", currentStyle + " user-select: text; -webkit-user-select: text;");
      }
    });

    targetIframeRef.current.srcdoc = "<!doctype html>\n" + doc.documentElement.outerHTML;
  };

  useEffect(() => {
    if (spine.length) displayPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spine, dark, fontSize, viewMode]);

  const prev = () => displayPage(viewMode === "spread" ? page - 2 : page - 1);
  const next = () => displayPage(viewMode === "spread" ? page + 2 : page + 1);
  const goToPage = (p) => displayPage(p);

  const addBookmark = () => {
    if (!bookmarks.includes(page)) {
      setBookmarks([...bookmarks, page].sort((a, b) => a - b));
    }
  };

  const removeBookmark = (p) => {
    setBookmarks(bookmarks.filter(b => b !== p));
  };

  const copyPageText = async () => {
    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
      if (iframeDoc) {
        const text = iframeDoc.body.innerText || iframeDoc.body.textContent;
        await navigator.clipboard.writeText(text);
        setCopyNotification(true);
        setTimeout(() => setCopyNotification(false), 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('Không thể copy. Hãy chọn văn bản và dùng Ctrl+C.');
    }
  };

  const totalPages = Math.max(1, spine.length - 1);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div className={`${dark ? "dark" : ""}`}>
      <div className={`fixed inset-0 flex flex-col ${dark ? "bg-[#1a1a2e]" : "bg-white"}`}>
        {/* Header */}
        <header
          className={`flex items-center justify-between gap-3 px-4 py-3 border-b ${
            dark ? "border-white/10 bg-[#16213e]" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-3 py-2 rounded-lg transition-all ${
                dark 
                  ? "hover:bg-white/10 text-gray-200" 
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              aria-label="Back"
            >
              ← Quay lại
            </button>
          </div>

          <div className={`font-semibold text-base truncate ${dark ? "text-gray-100" : "text-gray-800"}`}>
            {title}
          </div>

          <div className="flex items-center gap-2">
            <span className={`hidden sm:inline text-xs ${dark ? "text-gray-400" : "text-gray-500"}`}>
              💡 Bạn có thể chọn và copy văn bản
            </span>
            <span className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
              {viewMode === "spread" && page + 1 <= totalPages 
                ? `${page}-${page + 1}/${totalPages}`
                : `${page}/${totalPages}`
              }
            </span>

            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === "single" ? "spread" : "single")}
              className={`px-3 py-2 rounded-lg transition-all ${
                dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
              title={viewMode === "single" ? "Chế độ hai trang" : "Chế độ một trang"}
            >
              {viewMode === "single" ? "📖" : "📄"}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={addBookmark}
              className={`px-3 py-2 rounded-lg transition-all ${
                bookmarks.includes(page)
                  ? "text-yellow-500"
                  : dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
              title={bookmarks.includes(page) ? "Đã đánh dấu" : "Đánh dấu trang"}
            >
              {bookmarks.includes(page) ? "★" : "☆"}
            </button>

            {/* Bookmarks List */}
            <button
              onClick={() => setShowBookmarks(!showBookmarks)}
              className={`px-3 py-2 rounded-lg transition-all ${
                dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Danh sách đánh dấu"
            >
              📚
            </button>

            {/* Copy Text Button */}
            <button
              onClick={copyPageText}
              className={`px-3 py-2 rounded-lg transition-all ${
                dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Copy toàn bộ văn bản trang này"
            >
              📋
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`px-3 py-2 rounded-lg transition-all ${
                dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
              title="Cài đặt"
            >
              ⚙️
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setDark((d) => !d)}
              className={`px-3 py-2 rounded-lg transition-all ${
                dark ? "hover:bg-white/10 text-gray-300" : "hover:bg-gray-200 text-gray-600"
              }`}
              aria-label="Toggle theme"
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        {/* Settings Panel */}
        {showSettings && (
          <div className={`px-4 py-3 border-b ${dark ? "border-white/10 bg-[#16213e]" : "border-gray-200 bg-gray-50"}`}>
            <div className="max-w-md">
              <label className={`block text-sm mb-2 ${dark ? "text-gray-300" : "text-gray-700"}`}>
                Cỡ chữ: {fontSize}%
              </label>
              <input
                type="range"
                min="80"
                max="200"
                step="10"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-1">
                <button 
                  onClick={() => setFontSize(80)}
                  className={`${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Nhỏ
                </button>
                <button 
                  onClick={() => setFontSize(100)}
                  className={`${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Vừa
                </button>
                <button 
                  onClick={() => setFontSize(150)}
                  className={`${dark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Lớn
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bookmarks Panel */}
        {showBookmarks && (
          <div className={`px-4 py-3 border-b ${dark ? "border-white/10 bg-[#16213e]" : "border-gray-200 bg-gray-50"}`}>
            <div className={`text-sm mb-2 font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>
              Trang đã đánh dấu ({bookmarks.length})
            </div>
            {bookmarks.length === 0 ? (
              <div className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
                Chưa có trang nào được đánh dấu
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {bookmarks.map((b) => (
                  <button
                    key={b}
                    onClick={() => goToPage(b)}
                    className={`px-3 py-1 rounded flex items-center gap-2 text-sm ${
                      b === page
                        ? dark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"
                        : dark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Trang {b}
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(b);
                      }}
                      className="ml-1 hover:text-red-400"
                    >
                      ×
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 grid grid-cols-[48px_1fr_48px] items-center overflow-hidden">
          <button
            onClick={prev}
            disabled={page <= 1}
            className={`text-2xl h-full transition ${
              page <= 1 
                ? "opacity-20 cursor-not-allowed" 
                : dark 
                  ? "opacity-60 hover:opacity-100 hover:bg-white/5" 
                  : "opacity-60 hover:opacity-100 hover:bg-black/5"
            }`}
            aria-label="Previous page"
          >
            ‹
          </button>

          <div className="w-full h-full flex gap-1">
            <iframe 
              ref={iframeRef} 
              title="epub-left" 
              className={`h-full border-0 ${viewMode === "spread" ? "w-1/2" : "w-full"}`}
            />
            {viewMode === "spread" && page + 1 <= totalPages && (
              <iframe 
                ref={iframeRef2} 
                title="epub-right" 
                className="w-1/2 h-full border-0"
              />
            )}
          </div>

          <button
            onClick={next}
            disabled={viewMode === "spread" ? page + 1 >= totalPages : page >= totalPages}
            className={`text-2xl h-full transition ${
              (viewMode === "spread" ? page + 1 >= totalPages : page >= totalPages)
                ? "opacity-20 cursor-not-allowed" 
                : dark 
                  ? "opacity-60 hover:opacity-100 hover:bg-white/5" 
                  : "opacity-60 hover:opacity-100 hover:bg-black/5"
            }`}
            aria-label="Next page"
          >
            ›
          </button>
        </main>

        {/* Footer Progress Bar */}
        <div className={`h-1 ${dark ? "bg-white/10" : "bg-gray-200"}`}>
          <div 
            className={`h-full transition-all ${dark ? "bg-blue-500" : "bg-blue-600"}`}
            style={{ 
              width: `${viewMode === "spread" 
                ? ((page + 1) / totalPages) * 100 
                : (page / totalPages) * 100
              }%` 
            }}
          />
        </div>

        {/* Copy Notification */}
        {copyNotification && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            ✓ Văn bản có thể copy được! Dùng Ctrl+C hoặc chuột phải.
          </div>
        )}
      </div>
    </div>
  );
}