import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const nutritionistService = {
    getAllNutritionists: async () => {
        const response = await axios.get(`${API_URL}/nutritionists`);
        return response.data;
    },

    getNutritionistById: async (id) => {
        const response = await axios.get(`${API_URL}/nutritionists/${id}`);
        return response.data;
    },

    createNutritionist: async (nutritionistData, token) => {
        const response = await axios.post(`${API_URL}/nutritionists`, nutritionistData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateNutritionist: async (id, nutritionistData, token) => {
        const response = await axios.put(`${API_URL}/nutritionists/${id}`, nutritionistData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteNutritionist: async (id, token) => {
        const response = await axios.delete(`${API_URL}/nutritionists/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addReview: async (id, reviewData, token) => {
        const response = await axios.post(`${API_URL}/nutritionists/${id}/reviews`, reviewData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
}; 