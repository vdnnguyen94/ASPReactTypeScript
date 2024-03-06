//api-user.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = '/api/User'; // Assuming Vite is set up to proxy requests to your server

export const loginUser = async (username: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Login`, { username, password });
        // If login is successful, return the user object
        return response.data;
    } catch (error:any) {
        // If login fails, handle the error (e.g., display error message)
        throw new Error(error.response?.data || 'An unknown error occurred');
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/Logout`);
        // If logout is successful, return the success message
        return response.data;
    } catch (error:any) {
        // If logout fails, handle the error (e.g., display error message)
        throw new Error(error.response?.data || 'An unknown error occurred');
    }
};
export const readUser = async () => {
    try {
        // Read userID from the cookie
        const userID = Cookies.get('userID');
        if (!userID) {
            throw new Error('userID not found in cookie');
        }

        const response = await axios.get(`${API_BASE_URL}/Read?userID=${userID}`);
        // If read is successful, return the user data
        return response.data;
    } catch (error: any) {
        // If read fails, handle the error (e.g., display error message)
        throw new Error(error.response?.data || 'An unknown error occurred');
    }
};