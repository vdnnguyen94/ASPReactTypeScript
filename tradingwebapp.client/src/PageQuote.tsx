import React, { useState } from 'react';
import { lookup } from './api-quote';
import { Quote } from '../Models/Quote';

const QuoteComponent: React.FC = () => {
    const [symbol, setSymbol] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [numberOfStocks, setNumberOfStocks] = useState<number>(0);
    const [totalBookCost, setTotalBookCost] = useState<number>(0);
    const [quoteResult, setQuoteResult] = useState<Quote | null>(null);
    const [symbolError, setSymbolError] = useState<string | null>(null);
    const [stocksError, setStocksError] = useState<string | null>(null);
    const [quoteError, setQuoteError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Reset previous errors
        setSymbolError(null);
        setStocksError(null);
        setQuoteError(null);
        // Validation
        if (!symbol) {
            setSymbolError("Symbol is required.");
            return;
        }
        if (isNaN(numberOfStocks) || numberOfStocks < 0) {
            setStocksError("Number of stocks must be a non-negative integer.");
            return;
        }

        const quoteData = await lookup(symbol);
        if (quoteData) {
            setQuoteResult(quoteData);
            setName(quoteData.name); // Set the name from the quote data

            // Calculate the total book cost
            const price = quoteData.price;
            const totalCost = price * numberOfStocks;
            setTotalBookCost(totalCost);
        } else {
            setQuoteError(`No Information Found on the Symbol: ${symbol}`);
        }
    };

    return (
        <div className="Main">
        <div className="mb-3 mb-3-custom-width">
            <h2 className="center2">Real-Time Quotes</h2>
            <form onSubmit={handleSubmit}>
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

                <button className="btn btn-primary btnsp" type="submit">Get Quote</button>
            </form>
            {quoteError && <div className="text-danger"> <h4>{quoteError}</h4></div>}
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
                                <td>{quoteResult.price.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            </div>
        </div>
    );
};

export default QuoteComponent;
