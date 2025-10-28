import api from '../config/ApiConfig.js'

export const getUser = async (page = 0, size = 10) => {
    try{
        const response = await api.get("/admin/users", {
            params: { page, size }
        });
        console.log("Get user profile response:", response);
        return response;
    } catch (error) {
        console.error('Get user profile failed:', error.response?.data || error.message)
        throw error
    }
}