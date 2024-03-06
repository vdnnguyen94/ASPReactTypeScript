import axios from 'axios';
import { Quote } from '../Models/Quote'
import { BuyModel } from '../Models/BuyModel';
export const lookup = async (symbol: string) => {
    try {
        const response = await axios.post('/api/Quote/Lookup', symbol, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data as Quote;
    } catch (error) {
        console.error('Error fetching quote:', error);
        return null;
    }
};
export const buyStock = async (model: BuyModel) => {
    try {
        const response = await axios.post('/api/Transaction/Buy', model, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error buying stock:', error);
        return null;
    }
};
export const sellStock = async (model: BuyModel) => {
    try {
        const response = await axios.post('/api/Transaction/Sell', model, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error selling stock:', error);
        return null;
    }
};
