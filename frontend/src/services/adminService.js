import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const adminAPI = {
    getDashboardStats: async () => {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/admin/stats?token=${token}`);
        return response.data;
    },

    getAllUsers: async () => {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/admin/users?token=${token}`);
        return response.data;
    },

    createUser: async (userData) => {
        const token = getAuthToken();
        const response = await axios.post(`${API_BASE_URL}/admin/users?token=${token}`, userData);
        return response.data;
    },

    deleteUser: async (userId) => {
        const token = getAuthToken();
        const response = await axios.delete(`${API_BASE_URL}/admin/users/${userId}?token=${token}`);
        return response.data;
    },

    getAllMeetings: async () => {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/admin/meetings?token=${token}`);
        return response.data;
    },

    deleteMeeting: async (meetingId) => {
        const token = getAuthToken();
        const response = await axios.delete(`${API_BASE_URL}/admin/meetings/${meetingId}?token=${token}`);
        return response.data;
    },

    getAllMeetingSummaries: async () => {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/admin/summaries?token=${token}`);
        return response.data;
    },

    getMeetingSummaryById: async (id) => {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/admin/summaries/${id}?token=${token}`);
        return response.data;
    }
};
