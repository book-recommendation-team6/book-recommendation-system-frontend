import api from "../config/ApiConfig.js";

/**
 * Fetch genres with pagination support.
 * @param {{ page?: number, size?: number }} params
 * @returns {{ genres: Array, page: Object|null, message: string }}
 */
export const getGenres = async ({ page = 0, size = 50 } = {}) => {
  try {
    const response = await api.get("/books/genres", {
      params: { page, size },
    });

    const pageData = response.data ?? null;

    return {
      genres: pageData?.content ?? [],
      page: pageData,
      message: response.message,
    };
  } catch (error) {
    console.error("Error fetching genres:", error.response?.data || error.message);
    throw error;
  }
};
