/* ---- Bookmarks ---- */
const BookmarkList = ({
  bookmarks,
  onGo,
  editingId,
  setEditingId,
  renameBookmark,
  removeBookmark,
}) => {
  if (!bookmarks.length) {
    return <div className="text-gray-400 px-2">Chưa có dấu trang.</div>;
  }
  return (
    <ul className="space-y-1 pr-2">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="group flex items-center justify-between px-2 py-2 rounded hover:bg-white/5"
        >
          {editingId === b.id ? (
            <form
              className="flex-1 mr-2"
              onSubmit={(e) => {
                e.preventDefault();
                renameBookmark(b.id, e.target.elements.note.value.trim());
              }}
            >
              <input
                name="note"
                defaultValue={b.note}
                autoFocus
                onBlur={(e) => renameBookmark(b.id, e.target.value.trim())}
                className="w-full bg-transparent border-b border-white/20 outline-none"
              />
            </form>
          ) : (
            <button
              onClick={() => onGo(b)}
              className="text-left flex-1 text-gray-200 hover:text-emerald-400"
              title={b.note}
            >
              {b.note}
            </button>
          )}

          <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100">
            <button
              onClick={() => setEditingId(b.id)}
              className="p-1 rounded hover:bg-white/10"
              title="Đổi tên"
            >
              ✎
            </button>
            <button
              onClick={() => removeBookmark(b.id)}
              className="p-1 rounded hover:bg-white/10"
              title="Xóa"
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default BookmarkList;
