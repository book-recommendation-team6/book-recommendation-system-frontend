import api from '../config/ApiConfig.js'

export const getUser = async () => {
    try{
        const response = await api.get("/admin/users");
        console.log("Get user profile response:", response);
        return response.data.content;
    } catch (error) {
        console.error('Get user profile failed:', error.response?.data || error.message)
        throw error
    }
}