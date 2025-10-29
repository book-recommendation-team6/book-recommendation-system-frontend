import api from "../config/ApiConfig.js";

const defaultParams = {
  topRatedPage: 0,
  topRatedSize: 5,
  topFavoritedPage: 0,
  topFavoritedSize: 5,
};

/**
 * Fetch admin dashboard data.
 * @param {{ topRatedPage?: number, topRatedSize?: number, topFavoritedPage?: number, topFavoritedSize?: number }} params
 * @returns {{ dashboard: Object|null, message: string }}
 */
export const getAdminDashboard = async (params = {}) => {
  try {
    const response = await api.get("/admin/dashboard", {
      params: { ...defaultParams, ...params },
    });

    return {
      dashboard: response.data ?? null,
      message: response.message,
    };
  } catch (error) {
    console.error(
      "Error fetching admin dashboard:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

