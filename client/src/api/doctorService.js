import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const doctorService = {
    getAllDoctors: async () => {
        const response = await axios.get(`${API_URL}/doctors`);
        return response.data;
    },

    getDoctorById: async (id) => {
        const response = await axios.get(`${API_URL}/doctors/${id}`);
        return response.data;
    },

    createDoctor: async (doctorData, token) => {
        const response = await axios.post(`${API_URL}/doctors`, doctorData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateDoctor: async (id, doctorData, token) => {
        const response = await axios.put(`${API_URL}/doctors/${id}`, doctorData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    deleteDoctor: async (id, token) => {
        const response = await axios.delete(`${API_URL}/doctors/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    addReview: async (id, reviewData, token) => {
        const response = await axios.post(`${API_URL}/doctors/${id}/reviews`, reviewData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    }
}; 