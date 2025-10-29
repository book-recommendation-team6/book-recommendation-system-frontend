// EpubCoreViewer.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ePub from "epubjs";

import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";

import SidePanel from "./SidePanel";
import { AnimatePresence } from "framer-motion";
import useTheme from "../../hook/useTheme";
import useAuth from "../../hook/useAuth";

import { useLocation } from "react-router-dom";
import { recordReadingHistory } from "../../services/historyService";

const DEFAULT_POS_KEY = "reader:cfi";
const DEFAULT_BM_KEY = "reader:bookmarks";



export default function EpubCoreViewer({ onBack }) {
  const [theme, setTheme] = useTheme();
  const locationState = useLocation();
  const { user } = useAuth();

  const { src = "", book = {} } = locationState.state || {};
  const parsedBookId = typeof book?.id !== "undefined" ? Number(book.id) : null;
  const bookId = Number.isFinite(parsedBookId) ? parsedBookId : null;

  const storagePrefix = useMemo(() => {
    return user?.id ? `reader:user:${user.id}` : "reader:guest";
  }, [user?.id]);

  const posStorageKey = useMemo(() => {
    return bookId != null
      ? `${storagePrefix}:cfi:${bookId}`
      : `${storagePrefix}:${DEFAULT_POS_KEY}`;
  }, [storagePrefix, bookId]);

  const bmStorageKey = useMemo(() => {
    return bookId != null
      ? `${storagePrefix}:bookmarks:${bookId}`
      : `${storagePrefix}:${DEFAULT_BM_KEY}`;
  }, [storagePrefix, bookId]);

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(bmStorageKey) || "[]");
    } catch {
      return [];
    }
  });

  const [currentHref, setCurrentHref] = useState("");

  // Book info + location
  const [meta, setMeta] = useState({ title: book?.title || "", author: "" });
  const [toc, setToc] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // dựa trên locations
  const [page, setPage] = useState(1); // trang hiện tại (1-based)
  const [currentCfi, setCurrentCfi] = useState(() => localStorage.getItem(posStorageKey) || null);
  const [chapterTitle, setChapterTitle] = useState("");

  const resolveTheme = useCallback(() => {
    if (theme === "dark") return "dark";
    if (theme === "light") return "light";
    // system: nhìn class .dark trên <html> do hook đã set
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }, [theme]);

  const themeRef = useRef(resolveTheme());

  useEffect(() => {
    themeRef.current = resolveTheme();
  }, [resolveTheme]);

  const handleGoBack = useCallback(() => {
    if (typeof onBack === "function") {
      onBack();
      return;
    }
    window.history.back();
  }, [onBack]);

  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;
    const apply = () => r.themes.select(resolveTheme());

    apply(); // ⟵ áp ngay khi theme đổi
    r.on("rendered", apply); // ⟵ áp lại sau mỗi lần render trang
    return () => r.off("rendered", apply);
  }, [resolveTheme]);

  useEffect(() => {
    try {
      const savedBookmarks = JSON.parse(localStorage.getItem(bmStorageKey) || "[]");
      setBookmarks(Array.isArray(savedBookmarks) ? savedBookmarks : []);
    } catch {
      setBookmarks([]);
    }
  }, [bmStorageKey]);

  useEffect(() => {
    const savedCfi = localStorage.getItem(posStorageKey);
    setCurrentCfi(savedCfi || null);
  }, [posStorageKey]);

  // Refs to epub.js objects
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const bookRef = useRef(null);

  // Loading / error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // UI states
  // const [dark, setDark] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false); // thay cho tocOpen
  const [panelTab, setPanelTab] = useState("toc"); // "toc" | "bm"
  const [editingBmId, setEditingBmId] = useState(null); // id đang sửa

  // tiện truy cập nhanh id->item của TOC
  const tocByHref = useMemo(() => {
    const map = {};
    const walk = (items = []) => {
      for (const it of items) {
        if (it.href) map[it.href.split("#")[0]] = it;
        if (it.subitems?.length) walk(it.subitems);
      }
    };
    walk(toc);
    return map;
  }, [toc]);

  const saveCFI = useCallback((cfi) => {
    if (!cfi) return;
    setCurrentCfi(cfi);
    try {
      localStorage.setItem(posStorageKey, cfi);
    } catch (err) {
      console.error("Failed to persist reading position:", err);
    }
  }, [posStorageKey]);

  const lastProgressRef = useRef({ value: null, time: 0 });

  const recordHistory = useCallback(
    async (progressValue) => {
      if (!user?.id || bookId == null) return;
      const numericProgress = Number(progressValue);
      if (!Number.isFinite(numericProgress)) return;
      const normalized = Math.max(0, Math.min(100, numericProgress));
      try {
        await recordReadingHistory(user.id, bookId, { progress: normalized });
      } catch (err) {
        console.error("Failed to record reading history:", err);
      }
    },
    [bookId, user?.id],
  );

  const syncProgress = useCallback(
    (progressValue, force = false) => {
      if (!user?.id || bookId == null) return;
      const numericProgress = Number(progressValue);
      if (!Number.isFinite(numericProgress)) return;
      const normalized = Math.max(0, Math.min(100, numericProgress));
      const now = Date.now();
      const last = lastProgressRef.current;
      const progressDiff = last.value === null ? normalized : Math.abs(normalized - last.value);
      const timeDiff = now - (last.time ?? 0);

      if (!force && last.value !== null && progressDiff < 3 && timeDiff < 15000) {
        return;
      }

      lastProgressRef.current = { value: normalized, time: now };
      recordHistory(normalized);
    },
    [bookId, recordHistory, user?.id],
  );

  useEffect(() => {
    lastProgressRef.current = { value: null, time: 0 };
  }, [bookId, user?.id]);

  useEffect(() => {
    return () => {
      const lastValue = lastProgressRef.current.value;
      if (lastValue == null) return;
      recordHistory(lastValue);
    };
  }, [recordHistory]);

  const computeProgress = useCallback((index, total) => {
    if (!Number.isFinite(index) || !Number.isFinite(total) || total <= 0) {
      return 0;
    }
    if (total === 1) {
      return 100;
    }
    return Math.max(0, Math.min(100, (index / (total - 1)) * 100));
  }, []);

  // init
  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;

    if (!src) {
      setError("Không tìm thấy nguồn sách để đọc.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");
    const epubBook = ePub(src);
    bookRef.current = epubBook;

    const rendition = epubBook.renderTo(container, {
      width: "100%",
      height: "100%",
      flow: "paginated",
      manager: "default",
    });
    renditionRef.current = rendition;

    rendition.themes.register("light", {
      body: {
        background: "#ffffff",
        color: "#0f172a",
        lineHeight: 1.7,
        fontFamily:
          "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
      },
      h1: { fontWeight: "700", letterSpacing: "0.02em" },
      "p, li": { margin: "0 0 1em" },
    });
    rendition.themes.register("dark", {
      body: {
        background: "#111827",
        color: "#e5e7eb",
        lineHeight: 1.7,
        fontFamily:
          "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
      },
      a: { color: "#93c5fd" },
      h1: { fontWeight: "700", letterSpacing: "0.02em" },
      "p, li": { margin: "0 0 1em" },
    });
    rendition.themes.select(themeRef.current);
    rendition.themes.fontSize("110%");

    const toTotalLocations = () => {
      const locations = bookRef.current?.locations;
      if (!locations) return 0;
      if (typeof locations.length === "function") return locations.length();
      if (typeof locations.length === "number") return locations.length;
      return 0;
    };

    (async () => {
      try {
        await epubBook.ready;
        await epubBook.locations.generate(1024);
        const { title, creator } = epubBook.package?.metadata || {};
        setMeta({ title: title || book?.title || "", author: creator || "" });

        const nav = await epubBook.loaded.navigation;
        setToc(nav?.toc || []);

        const locations = epubBook.locations;
        let total = 0;
        if (locations) {
          if (typeof locations.length === "function") {
            total = locations.length();
          } else if (typeof locations.length === "number") {
            total = locations.length;
          }
        }
        setTotalPages(total);

        await rendition.display(currentCfi || undefined);

        if (locations?.locationFromCfi) {
          try {
            const idx = currentCfi ? locations.locationFromCfi(currentCfi) : 0;
            if (typeof idx === "number" && Number.isFinite(idx)) {
              setPage(idx + 1);
              if (total > 0) {
                const progress = computeProgress(idx, total);
                syncProgress(progress, true);
              } else {
                syncProgress(0, true);
              }
            } else {
              syncProgress(0, true);
            }
          } catch (err) {
            console.error("Failed to restore reading location:", err);
            syncProgress(0, true);
          }
        } else {
          syncProgress(0, true);
        }

        const off = () => {
          setIsLoading(false);
          rendition.off("rendered", off);
        };
        rendition.on("rendered", off);
      } catch (e) {
        setError("Không tải được sách. Vui lòng kiểm tra đường dẫn hoặc CORS.");
        setIsLoading(false);
        console.error("Epub init error:", e);
      }
    })();

    const onRelocated = (loc) => {
      const cfi = loc?.start?.cfi;
      if (cfi) saveCFI(cfi);

      let locationIndex = null;
      const locations = bookRef.current?.locations;
      if (cfi && locations?.locationFromCfi) {
        try {
          const idx = locations.locationFromCfi(cfi);
          if (typeof idx === "number" && Number.isFinite(idx)) {
            locationIndex = idx;
            setPage(idx + 1);
          }
        } catch (err) {
          console.error("Failed to derive location index:", err);
        }
      }

      const total = toTotalLocations();
      if (total > 0 && locationIndex !== null) {
        const progress = computeProgress(locationIndex, total);
        syncProgress(progress);
      }

      const href = loc?.start?.href?.split("#")[0] || "";
      setCurrentHref(href);

      const item = tocByHref[href];
      setChapterTitle(item?.label || "");
    };

    rendition.on("relocated", onRelocated);

    const onKey = (e) => {
      if (e.key === "ArrowLeft") rendition.prev();
      if (e.key === "ArrowRight") rendition.next();
    };
    window.addEventListener("keydown", onKey);

    const onResize = () => rendition.resize("100%", "100%");
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      rendition.off("relocated", onRelocated);
      try {
        epubBook.destroy();
      } catch {}
    };
  }, [src, currentCfi, saveCFI, syncProgress, bookId, computeProgress]);

  
  // Actions
  const goPrev = () => renditionRef.current?.prev();
  const goNext = () => renditionRef.current?.next();
  const goTo = (target) => renditionRef.current?.display(target);
  // const toggleTheme = () => {
  //   const next = !dark;
  //   setDark(next);
  //   renditionRef.current?.themes.select(next ? "dark" : "light");
  // };

  // “Trang X / Y” — input đổi trang
  const [pageInput, setPageInput] = useState("");
  useEffect(() => setPageInput(String(page || 1)), [page]);
  const jumpToInput = (e) => {
    e.preventDefault();
    const p = Math.max(1, Math.min(Number(pageInput || 1), totalPages || 1));
    // từ chỉ số trang -> CFI tương ứng
    try {
      const cfi = bookRef.current?.locations?.cfiFromLocation(p - 1);
      if (cfi) goTo(cfi);
    } catch {}
  };

  // Bookmark
  const toggleBookmark = () => {
    if (!currentCfi) return;
    const exists = bookmarks.some((b) => b.cfi === currentCfi);
    let next;
    if (exists) next = bookmarks.filter((b) => b.cfi !== currentCfi);
    else {
      const id = Date.now().toString(36); //Tạo id để sửa/xóa dễ
      next = [
        { id, cfi: currentCfi, note: chapterTitle || `Trang ${page}` },
        ...bookmarks,
      ].slice(0, 100);
    }
    setBookmarks(next);
    localStorage.setItem(bmStorageKey, JSON.stringify(next));
  };

  /** đổi tên bookmark */
  const renameBookmark = (id, newText) => {
    setBookmarks((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, note: newText || b.note } : b
      );
      localStorage.setItem(bmStorageKey, JSON.stringify(next));
      return next;
    });
    setEditingBmId(null);
  };

  /** xóa bookmark */
  const removeBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem(bmStorageKey, JSON.stringify(next));
      return next;
    });
  };

  /** toggle mở panel ở tab chỉ định */
  const openPanel = (tab = "toc") => {
    setPanelTab(tab);
    setPanelOpen(true);
  };

  // sau các useState khác
  const isBookmarked = useMemo(
    () => !!currentCfi && bookmarks.some((b) => b.cfi === currentCfi),
    [bookmarks, currentCfi]
  );

  return (
    <div className="relative h-screen select-none bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-20 h-14 bg-[#29292B] dark:bg-gray-600 text-gray-100 backdrop-blur flex items-center px-3">
        {/* Back */}
        <button
          onClick={handleGoBack}
          className="mr-2 px-2 py-1 rounded hover:bg-white/10"
          title="Quay lại"
        >
          ←
        </button>

        {/* Trang X / Y */}
        <form onSubmit={jumpToInput} className="flex items-center gap-2">
          <span className="hidden sm:inline">Trang</span>
          <input
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
            className="w-14 text-center rounded bg-black/30 border border-white/10 outline-none"
          />
          <span>/{totalPages || "–"}</span>
        </form>

        {/* Tiêu đề sách */}
        <div className="absolute inset-x-0 text-center pointer-events-none">
          <div className="font-semibold">{meta.title || "—"}</div>
        </div>

        {/* Nút phải */}
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            className="px-2 py-1 rounded hover:bg-white/10"
            title="Chế độ tối/sáng"
          >
            {resolveTheme() === 'dark' ? '🌙' : '☀️'}
          </button>
          {/* Bookmark: bấm để lưu/bỏ lưu, Ctrl+click hoặc right-click để mở panel Dấu trang */}
          <button
            onClick={toggleBookmark}
            onContextMenu={(e) => {
              e.preventDefault();
              openPanel("bm");
            }}
            onAuxClick={(e) => {
              if (e.button === 1 || e.ctrlKey) openPanel("bm");
            }}
            className="px-2 py-1 rounded hover:bg-white/10"
            title={
              isBookmarked
                ? "Bỏ dấu trang tại vị trí này"
                : "Thêm dấu trang tại vị trí này"
            }
          >
            {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
          </button>
          <button
            onClick={() => openPanel("toc")}
            className="px-2 py-1 rounded hover:bg-white/10"
            title="Mục lục"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Nội dung epub */}
      <div className="absolute top-18 bottom-10 left-0 right-0 shadow-lg max-w-[1280px] mx-auto">
        <div className="relative w-full h-full">
          {/* Khung epub.js */}
          <div ref={viewerRef} className="absolute inset-0" />

          {/* Loading overlay */}
          {isLoading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3
                            bg-black/40 text-white"
            >
              <div className="h-8 w-8 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              <div className="text-sm">Đang tải, vui lòng đợi…</div>
            </div>
          )}

          {/* Lỗi (nếu có) */}
          {error && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="max-w-md text-center rounded-lg bg-white/90 p-4 text-red-600">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Arrows lật trang */}
      <button
        onClick={goPrev}
        className="fixed text-5xl left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-gray-500 dark:text-white dark:hover:bg-white/20 hover:bg-gray-600 hover:text-gray-200"
        title="Trang trước"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={goNext}
        className="fixed right-4 text-5xl top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-gray-500 dark:text-white dark:hover:bg-white/20 hover:bg-gray-600 hover:text-gray-200"
        title="Trang sau"
      >
        <ChevronRight size={32}/>
      </button>

      {/* Footer: đếm trang */}
      <div className="fixed bottom-2 inset-x-0 text-center text-gray-200 z-10">
        {totalPages ? `${page}/${totalPages}` : ""}
      </div>

      {/* TOC Drawer */}
      <AnimatePresence>
        {panelOpen && (
          <SidePanel
            onClose={() => setPanelOpen(false)}
            tab={panelTab}
            setTab={setPanelTab}
            toc={toc}
            currentHref={currentHref}
            goTo={(t) => { goTo(t.cfi || t.href); }}
            bookmarks={bookmarks}
            onGoBookmark={(b) => { goTo(b.cfi); }}
            editingBmId={editingBmId}
            setEditingBmId={setEditingBmId}
            renameBookmark={renameBookmark}
            removeBookmark={removeBookmark}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
