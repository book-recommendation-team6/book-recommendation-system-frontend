import api from '../config/ApiConfig.js'

export const getRecommendedBooks = async (userId, limit = 10) => {
  try {
    const response = await api.get('/recommendations', {
      params: { userId, limit }
    });
    console.log("Recommended books response:", response);
    return response;
  } catch (error) {
    console.error("Failed to fetch recommended books:", error);
    throw error;
  }
};

export const getSimilarBooks = async (bookId, limit = 10) => {
  try {
    const response = await api.get('/similar-books', {
      params: { bookId, limit }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch similar books:", error);
    throw error;
  }
};

export const getDiversityBooks = async (bookId, { limit = 5 } = {}) => {
  try {
    const response = await api.get('/diversity-books', {
      params: {
        bookId,
        limit
      }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch diversity books:", error);
    throw error;
  }
};

export const getBookDetail = async (bookId) => {
  try {
    const response = await api.get(`/books/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch book detail:", error);
    throw error;
  }
};

/**
 * Get most read books (top books by reading history count)
 * @param {number} page - Page number (0-based)
 * @param {number} size - Number of books per page
 * @returns {Promise} Response with most read books
 */
export const getMostReadBooks = async (page = 0, size = 5) => {
  try {
    const response = await api.get('/books/most-read', {
      params: { page, size }
    });
    return response;
  } catch (error) {
    console.error("Failed to fetch most read books:", error);
    throw error;
  }
};
