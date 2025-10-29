import api from "../config/ApiConfig.js";

export const getUser = async (page = 0, size = 10, keyword = "") => {
  try {
    const params = { page, size };
    if (keyword?.trim()) {
      params.keyword = keyword.trim();
    }

    const response = await api.get("/admin/users", { params });
    return response;
  } catch (error) {
    console.error("Get users failed:", error.response?.data || error.message);
    throw error;
  }
};

export const banUser = async (userId) => {
  try {
    return await api.patch(`/users/${userId}/ban`);
  } catch (error) {
    console.error("Ban user failed:", error.response?.data || error.message);
    throw error;
  }
};

export const unbanUser = async (userId) => {
  try {
    return await api.patch(`/users/${userId}/unban`);
  } catch (error) {
    console.error("Unban user failed:", error.response?.data || error.message);
    throw error;
  }
};
