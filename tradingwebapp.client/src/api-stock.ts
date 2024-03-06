import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = '/api/Stock'; // Assuming Vite is set up to proxy requests to your server

export const readStock = async () => {
    try {
        // Read userID from the cookie
        const userID = Cookies.get('userID');
        if (!userID) {
            throw new Error('userID not found in cookie');
        }

        // Convert userID to integer
        const userIdInt = parseInt(userID);

        const response = await axios.get(`${API_BASE_URL}/Read?userId=${userIdInt}`);
        // If read is successful, return the stock data
        return response.data;
    } catch (error: any) {
        // If read fails, handle the error (e.g., display error message)
        throw new Error(error.response?.data || 'An unknown error occurred');
    }
};

// Define the Stock model in TypeScript
export interface Stock {
    stockID: number;
    symbol: string;
    userId: number;
    name: string;
    shares: number;
    price?: number;
}
