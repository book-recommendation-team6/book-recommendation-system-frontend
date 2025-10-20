import TocList from "./TocList.jsx";
import BookmarkList from "./BookMarkList.jsx";

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
  return (
    <div className="fixed top-14 right-0 bottom-0 z-30 w-80 bg-[#2b2b2f] text-gray-100 shadow-xl border-l border-black/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-white/10">
        <div className="text-lg font-semibold">Danh sách</div>
        <button
          onClick={onClose}
          className="text-gray-300 hover:text-white"
          title="Đóng"
        >
          ✕
        </button>
      </div>

      {/* Tabs */}
      <div className="px-4 pt-2">
        <div className="flex gap-6 text-sm">
          <button
            onClick={() => setTab("toc")}
            className={`pb-2 ${
              tab === "toc"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-300 hover:text-white"
            }`}
          >
            Mục lục
          </button>
          <button
            onClick={() => setTab("bm")}
            className={`pb-2 ${
              tab === "bm"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-300 hover:text-white"
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
    </div>
  );
}

export default SidePanel;