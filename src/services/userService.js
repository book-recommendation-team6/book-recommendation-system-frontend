import api from '../config/ApiConfig.js'

export const updateUserProfile = async (userId, profileData) => {
    try {
        const response = await api.put(`/users/${userId}`, profileData);
        console.log('Update profile response:', response);
        return response.data;
    } catch (error) {
        console.error('Update profile failed:', error.response?.data || error.message);
        throw error;
    }
}