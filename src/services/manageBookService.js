import api from "../config/ApiConfig.js";

export const getBooks = async (page = 0, size = 10, filters = {}) => {
  try {
    const params = { page, size };
    
    // Add filter params if they exist
    if (filters.genreIds && filters.genreIds.length > 0) {
      params.genreIds = filters.genreIds.join(',');
    }
    if (filters.author && filters.author.length > 0) {
      params.author = Array.isArray(filters.author) ? filters.author[0] : filters.author;
    }
    if (filters.publisher && filters.publisher.length > 0) {
      params.publisher = Array.isArray(filters.publisher) ? filters.publisher[0] : filters.publisher;
    }

    console.log("[getBooks] Params:", params);
    const response = await api.get("/books", { params });
    console.log("[getBooks] Response:", response);
    return response;
  } catch (error) {
    console.error("Get books failed:", error.response?.data || error.message);
    throw error;
  }
};

export const getBooksByGenre = async (genreId, page = 0, size = 10) => {
  try {
    const response = await api.get(`/books/genre/${genreId}`, {
      params: { page, size }
    });
    return response;
  } catch (error) {
    console.error("Get books by genre failed:", error.response?.data || error.message);
    throw error;
  }
};

export const searchBooks = async (keyword, page = 0, size = 10, filters = {}) => {
  try {
    const params = { keyword, page, size };
    
    // Add filter params if they exist
    if (filters.genreIds && filters.genreIds.length > 0) {
      params.genreIds = filters.genreIds.join(',');
    }
    if (filters.author && filters.author.length > 0) {
      params.author = Array.isArray(filters.author) ? filters.author[0] : filters.author;
    }
    if (filters.publisher && filters.publisher.length > 0) {
      params.publisher = Array.isArray(filters.publisher) ? filters.publisher[0] : filters.publisher;
    }

    console.log("[searchBooks] Params:", params);
    const response = await api.get("/books/search", { params });
    console.log("[searchBooks] Response:", response);
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
