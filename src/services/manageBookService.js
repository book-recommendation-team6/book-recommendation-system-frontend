import api from "../config/ApiConfig.js";

export const getBooks = async (page = 0, size = 10) => {
  try {
    const response = await api.get("/books", {
      params: { page, size }
    });
    // console.log("Get books response:", response);
    return response;
  } catch (error) {
    console.error("Get books failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getBooksByGenre = async (genreId, pageOrOptions = {}, size = 10) => {
  try {
    let page = 0;
    let pageSize = 10;
    let sort = "";

    if (typeof pageOrOptions === "number") {
      page = pageOrOptions;
      pageSize = size;
    } else if (typeof pageOrOptions === "object" && pageOrOptions !== null) {
      page = pageOrOptions.page ?? 0;
      pageSize = pageOrOptions.size ?? 10;
      sort = pageOrOptions.sort ?? "";
    }

    const params = { page, size: pageSize };
    if (sort?.trim()) {
      params.sort = sort.trim();
    }

    const response = await api.get(`/books/genre/${genreId}`, {
      params
    });
    return response;
  } catch (error) {
    console.error("Get books by genre failed:", error.response?.data || error.message);
    throw error;
  }
};

export const searchBooks = async (keyword, page = 0, size = 10) => {
  try {
    const response = await api.get("/books/search", {
      params: { keyword, page, size }
    });
    return response;
  } catch (error) {
    console.error("Search books failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getBookDetail = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    // console.log("Get book detail response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Get book detail failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const createBook = async (payload) => {
  try {
    const response = await api.post("/admin/books/create", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Create book response:", response);
    return response;
  } catch (error) {
    console.error("Create book failed:", error.response?.data || error.message);
    throw error;
  }
};

export const updateBook = async (bookId, payload) => {
  try {
    const response = await api.put(`/admin/books/update/${bookId}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Update book response:", response);
    return response;
  } catch (error) {
    console.error("Update book failed:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteBook = async (bookId) => {
  try {
    const response = await api.delete(`/admin/books/delete/${bookId}`);
    console.log("Delete book response:", response);
    return response;
  } catch (error) {
    console.error("Delete book failed:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteBooksBulk = async (bookIds = []) => {
  try {
    return await api.delete("/admin/books", {
      data: { ids: bookIds },
    });
  } catch (error) {
    console.error("Bulk delete books failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getAdminBooks = async ({
  page = 0,
  size = 10,
  keyword = "",
  genreId,
  sort = "",
} = {}) => {
  try {
    const params = { page, size };
    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }
    if (genreId !== undefined && genreId !== null && genreId !== "") {
      params.genreId = genreId;
    }
    if (sort?.trim()) {
      params.sort = sort.trim();
    }

    return await api.get("/admin/books", { params });
  } catch (error) {
    console.error("Get admin books failed:", error.response?.data || error.message);
    throw error;
  }
};
