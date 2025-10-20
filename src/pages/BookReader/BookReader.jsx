// EpubCoreViewer.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import ePub from "epubjs";

import SidePanel from "./SidePanel";

const LS_POS_KEY = "reader:cfi";
const LS_BM_KEY = "reader:bookmarks";

export default function EpubCoreViewer({
  src = "https://tiemsach.org/ebook/Lich Su Van Vat - Bill Bryson.epub",
  onBack,
}) {

  // Refs to epub.js objects
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const bookRef = useRef(null);

  // Loading / error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // UI states
  const [dark, setDark] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false); // thay cho tocOpen
  const [panelTab, setPanelTab] = useState("toc"); // "toc" | "bm"
  const [editingBmId, setEditingBmId] = useState(null); // id đang sửa

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(LS_BM_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const [currentHref, setCurrentHref] = useState("");

  // Book info + location
  const [meta, setMeta] = useState({ title: "", author: "" });
  const [toc, setToc] = useState([]);
  const [totalPages, setTotalPages] = useState(0); // dựa trên locations
  const [page, setPage] = useState(1); // trang hiện tại (1-based)
  const [location, setLocation] = useState(
    () => localStorage.getItem(LS_POS_KEY) || null
  );
  const [chapterTitle, setChapterTitle] = useState("");

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
    setLocation(cfi);
    localStorage.setItem(LS_POS_KEY, cfi);
  }, []);

  // init
  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;

    setIsLoading(true);
    setError("");
    const book = ePub(src);
    bookRef.current = book;

    const rendition = book.renderTo(container, {
      width: "100%",
      height: "100%",
      flow: "paginated", // "scrolled" nếu muốn cuộn
      manager: "default",
      // allowScriptedContent: true, // bật nếu file cần JS
    });
    renditionRef.current = rendition;

    // Themes
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
    rendition.themes.select(dark ? "dark" : "light");
    rendition.themes.fontSize("110%");

    // Meta + TOC + Locations (đếm trang)
    (async () => {
      try {
        await book.ready;
        await book.locations.generate(1024);
        const { title, creator } = book.package?.metadata || {};
        setMeta({ title: title || "", author: creator || "" });

        const nav = await book.loaded.navigation;
        setToc(nav?.toc || []);

        // generate "locations" để có số trang ước lượng ổn định
        // Mặc định 1000 chữ / location; bạn có thể tinh chỉnh để “20 trang” như mock
        //   await book.locations.generate(1024);
        let total = 0;
        if (book.locations) {
          if (typeof book.locations.length === "function") {
            total = book.locations.length(); // đa số bản dùng length()
          } else if (typeof book.locations.length === "number") {
            total = book.locations.length; // một số build gắn length là số
          }
        }
        setTotalPages(total);

        // display vị trí hiện tại (hoặc đầu sách)
        await rendition.display(location || undefined);
        // Khi frame đầu render xong, tắt loading
        const off = () => {
          setIsLoading(false);
          rendition.off("rendered", off);
        };
        rendition.on("rendered", off);
      } catch (e) {
        setError("Không tải được sách. Vui lòng kiểm tra đường dẫn hoặc CORS.");
        setIsLoading(false);
      }
    })();

    // cập nhật page/chapter khi relocate
    const onRelocated = (loc) => {
      const cfi = loc?.start?.cfi;
      if (cfi) saveCFI(cfi);

      // cập nhật trang hiện tại (nếu đã generate locations)
      if (bookRef.current?.locations?.locationFromCfi) {
        const idx = bookRef.current.locations.locationFromCfi(cfi);
        if (typeof idx === "number") setPage(idx + 1);
      }

      // lưu href cho highlight mục lục
      const href = loc?.start?.href?.split("#")[0] || "";
      setCurrentHref(href);

      // cập nhật tiêu đề chương (như trước)
      const item = tocByHref[href];
      setChapterTitle(item?.label || "");
    };

    rendition.on("relocated", onRelocated);

    // phím tắt
    const onKey = (e) => {
      if (e.key === "ArrowLeft") rendition.prev();
      if (e.key === "ArrowRight") rendition.next();
    };
    window.addEventListener("keydown", onKey);

    // Resize khi khung thay đổi (div cha dùng h-screen)
    const onResize = () => rendition.resize("100%", "100%");
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      try {
        book.destroy();
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, dark, saveCFI]); // đổi theme sẽ apply ngay lần init

  // Actions
  const goPrev = () => renditionRef.current?.prev();
  const goNext = () => renditionRef.current?.next();
  const goTo = (target) => renditionRef.current?.display(target);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    renditionRef.current?.themes.select(next ? "dark" : "light");
  };

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
    if (!location) return;
    const exists = bookmarks.some((b) => b.cfi === location);
    let next;
    if (exists) next = bookmarks.filter((b) => b.cfi !== location);
    else {
      const id = Date.now().toString(36); //Tạo id để sửa/xóa dễ
      next = [
        { id, cfi: location, note: chapterTitle || `Trang ${page}` },
        ...bookmarks,
      ].slice(0, 100);
    }
    setBookmarks(next);
    localStorage.setItem(LS_BM_KEY, JSON.stringify(next));
  };

  /** đổi tên bookmark */
  const renameBookmark = (id, newText) => {
    setBookmarks((prev) => {
      const next = prev.map((b) =>
        b.id === id ? { ...b, note: newText || b.note } : b
      );
      localStorage.setItem(LS_BM_KEY, JSON.stringify(next));
      return next;
    });
    setEditingBmId(null);
  };

  /** xóa bookmark */
  const removeBookmark = (id) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      localStorage.setItem(LS_BM_KEY, JSON.stringify(next));
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
    () => !!location && bookmarks.some((b) => b.cfi === location),
    [bookmarks, location]
  );

  return (
    <div className="relative h-screen select-none">
      {/* Header */}
      <div className="fixed top-0 inset-x-0 z-20 h-14 bg-[#29292B] text-gray-100 backdrop-blur flex items-center px-3">
        {/* Back */}
        <button
          onClick={onBack}
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
            onClick={toggleTheme}
            className="px-2 py-1 rounded hover:bg-white/10"
            title="Chế độ tối/sáng"
          >
            🌙
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
            {isBookmarked ? "★" : "☆"}
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
        className="fixed text-5xl left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full text-red-500 hover:bg-white/20"
        title="Trang trước"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        className="fixed right-4 text-5xl top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white text-red-500 hover:bg-white/20"
        title="Trang sau"
      >
        ›
      </button>

      {/* Footer: đếm trang */}
      <div className="fixed bottom-2 inset-x-0 text-center text-gray-200 z-10">
        {totalPages ? `${page}/${totalPages}` : ""}
      </div>

      {/* TOC Drawer */}
      {panelOpen && (
        <SidePanel
          dark={dark}
          onClose={() => setPanelOpen(false)}
          tab={panelTab}
          setTab={setPanelTab}
          toc={toc}
          currentHref={currentHref}
          goTo={(t) => {
            goTo(t.cfi || t.href);
          }}
          bookmarks={bookmarks}
          onGoBookmark={(b) => {
            goTo(b.cfi);
          }}
          editingBmId={editingBmId}
          setEditingBmId={setEditingBmId}
          renameBookmark={renameBookmark}
          removeBookmark={removeBookmark}
        />
      )}
    </div>
  );
}
