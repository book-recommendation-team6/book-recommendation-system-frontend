import api from "../config/ApiConfig.js";

/**
 * Fetch genres with pagination support.
 * @param {{ page?: number, size?: number, keyword?: string, sort?: string }} params
 * @returns {{ genres: Array, page: Object|null, message: string }}
 */
export const getGenres = async ({ page = 0, size = 50, keyword = "", sort = "" } = {}) => {
  try {
    const params = { page, size };
    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }
    if (sort?.trim()) {
      params.sort = sort.trim();
    }

    const response = await api.get("/books/genres", { params });

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

/**
 * Create a new genre
 * @param {{ name: string, description: string }} genreData
 */
export const createGenre = async (genreData) => {
  try {
    const response = await api.post("/admin/genres/create", genreData);
    return response.data;
  } catch (error) {
    console.error("Error creating genre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing genre
 * @param {number} genreId
 * @param {{ name: string, description: string }} genreData
 */
export const updateGenre = async (genreId, genreData) => {
  try {
    const response = await api.put(`/admin/genres/update/${genreId}`, genreData);
    return response.data;
  } catch (error) {
    console.error("Error updating genre:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a genre
 * @param {number} genreId
 */
export const deleteGenre = async (genreId) => {
  try {
    const response = await api.delete(`/admin/genres/delete/${genreId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting genre:", error.response?.data || error.message);
    throw error;
  }
};
