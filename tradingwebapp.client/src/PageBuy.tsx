import React, { useState, useEffect } from 'react';
import { lookup, buyStock } from './api-quote';
import { Quote } from '../Models/Quote';
import { BuyModel } from '../Models/BuyModel';
import { readUser } from './api-user'; 
import Cookies from 'js-cookie';
import { readStock, Stock } from './api-stock';

const BuyPage: React.FC = () => {
    const [symbol, setSymbol] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [numberOfStocks, setNumberOfStocks] = useState<number>(0);
    const [totalBookCost, setTotalBookCost] = useState<number>(0);
    const [quoteResult, setQuoteResult] = useState<Quote | null>(null);
    const [symbolError, setSymbolError] = useState<string | null>(null);
    const [stocksError, setStocksError] = useState<string | null>(null);
    const [quoteError, setQuoteError] = useState<string | null>(null);
    const [userData, setUserData] = useState<{ username: string; cash: number;} | null>(null);
    const [showBalance, setShowBalance] = useState<boolean>(true);
    const [userStocks, setUserStocks] = useState<Stock[]>([]);
 
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await readUser(); 
                setUserData(userData);
            } catch (error: any) {
                console.error('Error fetching user data:', error.message);
            }

        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUserStocks = async () => {

            const stocksData = await readStock();
            setUserStocks(stocksData);
        }
 

        fetchUserStocks();
    }, []);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    const handleSubmit = async () => {
        setSymbolError(null);
        setStocksError(null);
        setQuoteError(null);
        if (!symbol) {
            setSymbolError("Symbol is required.");
            return;
        }
        if (isNaN(numberOfStocks) || numberOfStocks < 1) {
            setStocksError("Number of stocks must be greater than or equal to 1.");
            return;
        }

        const quoteData = await lookup(symbol);
        if (quoteData) {
            setQuoteResult(quoteData);
            setName(quoteData.name);

            const price = quoteData.price;
            const totalCost = price * numberOfStocks;
            setTotalBookCost(totalCost);
        } else {
            setQuoteError(`No Information Found on the Symbol: ${symbol}`);
        }
    };

    const handleBuy = async () => {
        handleSubmit(); 
        if (!stocksError && !quoteError && userData) {
            if (totalBookCost > userData.cash) {
                setQuoteError("Insufficient funds.");
                return;
            }
            const userId = Cookies.get('userID');

            if (userId !== undefined) {
                const userIdInt = parseInt(userId, 10);


                const confirmPurchase = window.confirm("Are you sure you want to make this purchase?");
                if (confirmPurchase) {
                    const buyModel: BuyModel = {
                        UserID: userIdInt,
                        Symbol: symbol.toUpperCase(),
                        Name: name,
                        NumberOfShares: numberOfStocks,
                        TotalBookCost: totalBookCost,
                        ShareValue: quoteResult ? quoteResult.price : 0
                    };

                    // Call API to buy stock
                    const result = await buyStock(buyModel); // Make sure to await the buyStock function
                    if (result) {
                        window.alert('Stock bought successfully'); // or any other message you want to display
                        window.location.reload();
                    } else {
                        window.alert('Failed to buy stock');
                    }
                }
            }
        }
    };



    return (
        <div className="Main">
        <div className="mb-3 mb-3-custom-width">
            <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Investment Opportunities</h2>
                <div className="d-flex align-items-center">
                    <button className="btn btn-primary mr-2" onClick={toggleBalance}>
                        {showBalance ? 'Hide Balance' : 'Show Balance'}
                    </button>
                    {showBalance && userData && (
                        <p><strong>Balance: ${userData.cash.toFixed(2)}</strong></p>
                    )}
                </div>
            </div>
            <div>
                <label className="form-label">Symbol:</label>
                <input className="form-control" type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                {symbolError && <div className="text-danger">{symbolError}</div>}
            </div>

            <div>
                <label className="form-label">Number of Stocks:</label>
                <input className="form-control" type="number" value={numberOfStocks} onChange={(e) => setNumberOfStocks(parseInt(e.target.value))} />
                {stocksError && <div className="text-danger">{stocksError}</div>}
            </div>

            <div className="d-flex"> 
                <button className="btn btn-primary btnsp mr-2" onClick={handleSubmit}>Get Quote</button>
                <button className="btn btn-primary btnsp" onClick={handleBuy}>Buy</button>
            </div>
            {quoteError && <div className="text-danger"><h4>{quoteError}</h4></div>}
            <div>
                <label className="form-label">Name:</label>
                <input className="form-control gray-input" type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ fontWeight: "bold" }} disabled />
            </div>
            <div>
                <label className="form-label">Total Book Cost:</label>
                <input className="form-control gray-input" type="number" value={totalBookCost.toFixed(2)} onChange={(e) => setTotalBookCost(parseFloat(e.target.value))} style={{ fontWeight: "bold" }} disabled />
            </div>

            {quoteResult && (
                <div>
                    <div className="alert alert-success w-50 container screensize0"><h2>Quote Result</h2></div>
                    <table className="table table-sm w-50 container screensize0">
                        <thead className="table-active">
                            <tr>
                                <th scope="col">Symbol</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="table-primary">
                                <td>{quoteResult.symbol}</td>
                                <td>{quoteResult.name}</td>
                                <td>{quoteResult.price}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}

                <div className="user-stocks">
                    <h2 className="center2">Your Stocks</h2>
                    {userStocks.length > 0 ? (
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Symbol</th>
                                    <th>Name</th>
                                    <th>Number of Shares</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userStocks.map((stock, index) => (
                                    <tr key={index}>
                                        <td>{stock.symbol}</td>
                                        <td>{stock.name}</td>
                                        <td>{stock.shares}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h3 className="center2">You don't have any stock in your Account.</h3>
                    )}
                </div>
           
            </div>
        </div>
    );
};

export default BuyPage;
