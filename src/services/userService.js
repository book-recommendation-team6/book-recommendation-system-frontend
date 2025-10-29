import api from "../config/ApiConfig.js"

export const updateUserProfile = async (userId, profileData) => {
  try {
    const payload = {
      username: profileData.username,
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      avatarUrl: profileData.avatarUrl,
    }

    const response = await api.put(`/users/${userId}/update`, payload)
    console.log("Update profile response:", response)
    return response.data
  } catch (error) {
    console.error("Update profile failed:", error.response?.data || error.message)
    throw error
  }
}

export const updateUserAvatar = async (userId, file) => {
  try {
    const formData = new FormData()
    formData.append("avatar", file)

    const response = await api.patch(`/users/${userId}/avatar`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    console.log("Update avatar response:", response)
    return response.data
  } catch (error) {
    console.error("Update avatar failed:", error.response?.data || error.message)
    throw error
  }
}

export const changeUserPassword = async (userId, passwordData) => {
  try {
    const response = await api.patch(`/users/${userId}/change-password`, passwordData)
    console.log("Change password response:", response)
    return response.data
  } catch (error) {
    console.error("Change password failed:", error.response?.data || error.message)
    throw error
  }
}
