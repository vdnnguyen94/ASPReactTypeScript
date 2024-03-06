import axios from 'axios';
import Cookies from 'js-cookie';

export const listTransactions = async () => {
    try {
        // Obtain userID from the cookie
        const userID = Cookies.get('userID');
        if (!userID) {
            throw new Error('userID not found in cookie');
        }

        // Convert userID to integer
        const userIdInt = parseInt(userID);

        // Fetch transactions for the user
        const response = await axios.get(`/api/Transaction/GetTransactions/${userIdInt}`)
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return null;
    }
};
