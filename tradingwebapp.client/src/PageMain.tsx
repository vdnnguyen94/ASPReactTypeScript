import React, { useEffect, useState } from 'react';
import { readUser } from './api-user';
import { readStock, Stock } from './api-stock';
import { lookup } from './api-quote';

//Hello Van Nguyen
/*
The MainApp page displays a user’s portfolio, showing their cash balance, stock holdings, total stock value, 
and overall assets. It fetches data in real-time, calculates key metrics, and organizes stock details 
in a table for easy viewing.
*/
const MainApp: React.FC = () => {
    const [userData, setUserData] = useState<{ username: string; cash: number; } | null>(null);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [totalValues, setTotalValues] = useState<number>(0);
    const [totalAssets, setTotalAssets] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userData = await readUser();
                setUserData(userData);

                const stocksData = await readStock();
 

                const updatedStocksData = await Promise.all(stocksData.map(async (stock: Stock) => {
                    const quote = await lookup(stock.symbol);
                    if (quote) {
                        return { ...stock, price: quote.price };
                    }
                    return stock;
                }));
                setStocks(updatedStocksData);
                const totalValues = updatedStocksData.reduce((total, stock) => {
                    return total + (stock.price * stock.shares);
                }, 0);
                setTotalValues(totalValues);

                const assets = userData?.cash ? userData.cash + totalValues : totalValues;
                setTotalAssets(assets);
            } catch (error: any) {
                console.error('Error fetching data:', error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="Main">
            <div className="mb-3 mb-3-custom-width"> <h1 className="center2">{userData ? `${userData.username}'s Portfolio` : 'User data not available'}</h1></div>
            {stocks.length > 0 ? (
                <table className="table table-sm container screensize0">
                    <thead className="table-active">
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Shares</th>
                            <th>Unit Price</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map(stock => (
                            <tr key={stock.stockID} className="table-primary screensize0">
                                <td>{stock.symbol}</td>
                                <td>{stock.name}</td>
                                <td>{stock.shares}</td>
                                <td>${stock.price?.toFixed(2) ?? 'N/A'}</td>
                                <td>${((stock.price ?? 0) * stock.shares).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="table-info screensize0">
                            <th className="col-xs-6 screensize1">Your Stock Worths</th>
                            <td className="col-xs-6 screensize1">${totalValues.toFixed(2)}</td>
                        </tr>
                        <tr className="table-info screensize0">
                            <th className="col-xs-6 screensize1">Your Total Assets</th>
                            <td className="col-xs-6 screensize1">${totalAssets.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
            ) : (
                <h3 className="center2">There are no stocks in your account.</h3>
            )}
        </div>
    );
};

export default MainApp;
