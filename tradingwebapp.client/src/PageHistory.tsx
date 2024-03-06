import React, { useState, useEffect } from 'react';
import { listTransactions } from './api-transaction'; // Import the listTransactions function
import { readUser } from './api-user'
interface Transaction {
    transTime: string;
    type: string;
    symbol: string;
    name: string;
    shares: number;
    shareValue: number;
    totalValues: number;
}

const PageTransaction: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [showBalance, setShowBalance] = useState<boolean>(true);
    const [userData, setUserData] = useState<{ cash: number } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user data here
                // Make sure you have the readUser function implemented properly
                const userData = await readUser();
                setUserData(userData);
            } catch (error: any) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // Fetch transactions using the listTransactions function
                const transactionsData = await listTransactions();
                setTransactions(transactionsData);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, []);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };
    const formatTransactionTime = (time: string) => {
        const index = time.indexOf('.');
        const formattedTime = index !== -1 ? time.substring(0, index) : time;
        return formattedTime;
    };

    return (
        <div className="Main">
            <div className="mb-3 mb-3-custom-width w-75">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2>Transaction History</h2>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-primary mr-2" onClick={toggleBalance}>
                            {showBalance ? 'Hide Balance' : 'Show Balance'}
                        </button>
                        {showBalance && userData && (
                            <p><strong>Balance: ${userData.cash.toFixed(2)}</strong></p>
                        )}
                    </div>
                </div>
                </div>
            
            {transactions ? (
                <table className="table table-sm w-75 container screensize3">
                    <thead className="table-active">
                        <tr>
                            <th>Date and Time</th>
                            <th>Transaction type</th>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Shares</th>
                            <th>Unit Price</th>
                            <th>Total Values</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index} className="table-primary">
                                <td>{formatTransactionTime(transaction.transTime)}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.symbol}</td>
                                <td>{transaction.name}</td>
                                <td>{transaction.shares}</td>
                                <td>{transaction.shareValue}</td>
                                <td>{transaction.totalValues}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <h3 className="center2">Loading...</h3>
            )}
        </div>
    );
};

export default PageTransaction;
