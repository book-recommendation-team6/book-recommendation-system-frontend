import TocList from "./TocList.jsx";
import BookmarkList from "./BookMarkList.jsx";
import { motion } from "framer-motion";
import { useEffect } from "react";

const panelVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const SidePanel = ({
  dark,
  onClose,
  tab,
  setTab,
  toc,
  currentHref,
  goTo,
  bookmarks,
  onGoBookmark,
  editingBmId,
  setEditingBmId,
  renameBookmark,
  removeBookmark,
}) => {

  // Esc để đóng
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <motion.button
        aria-label="Đóng panel"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={overlayVariants}
        transition={{ duration: 0.18 }}
      />

      {/* Panel trượt từ phải */}
      <motion.aside
        className="fixed top-14 right-0 bottom-0 z-40 w-80 bg-gray-100 text-gray-800 dark:bg-[#2b2b2f] dark:text-gray-100 shadow-xl border-l border-black/20"
        role="dialog"
        aria-modal="true"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={panelVariants}
        transition={{ type: "tween", duration: 0.22, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-white/10">
          <div className="text-lg font-semibold">Danh sách</div>
          <button onClick={onClose} title="Đóng">✕</button>
        </div>

        {/* Tabs */}
        <div className="px-4 pt-2">
          <div className="flex gap-6 text-sm">
            <button
              onClick={() => setTab("toc")}
              className={`pb-2 ${
                tab === "toc"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-black dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              Mục lục
            </button>
            <button
              onClick={() => setTab("bm")}
              className={`pb-2 ${
                tab === "bm"
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "dark:text-white text-gray-800 "
              }`}
            >
              Dấu trang
            </button>
          </div>
          <div className="border-b border-white/10" />
        </div>

        {/* Body */}
        <div className="px-2 py-3 overflow-y-auto h-[calc(100%-12rem)]">
          {tab === "toc" ? (
            <TocList toc={toc} currentHref={currentHref} goTo={goTo} />
          ) : (
            <BookmarkList
              bookmarks={bookmarks}
              onGo={onGoBookmark}
              editingId={editingBmId}
              setEditingId={setEditingBmId}
              renameBookmark={renameBookmark}
              removeBookmark={removeBookmark}
            />
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default SidePanel;
