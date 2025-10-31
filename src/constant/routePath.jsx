export const PATHS = {
  HOME: "/",
  SEARCH: "/search",
  CATEGORY: "/category/:categoryId",
  MANAGE_ACCOUNT_REDIRECT: {
    ROOT: "/manage-account",
    PROFILE: "/manage-account/profile",
    FAVORITE_BOOKS: "/manage-account/favorite-books",
    HISTORY_READING: "/manage-account/history-reading",
  },
  MANAGE_ACCOUNT_CHILD: {
    PROFILE: "profile",
    FAVORITE_BOOKS: "favorite-books",
    HISTORY_READING: "history-reading",
  },
  ADMIN: {
    ROOT: "/admin",
    USERS: "/admin/users",
    BOOKS: "/admin/books",
    ADD_BOOK: "/admin/books/add",
    EDIT_BOOK: "/admin/books/edit/:id",
    GENRES: "/admin/genres",
  },
}
