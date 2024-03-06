import React, { useState } from 'react';
import { loginUser } from './api-user';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Call loginUser function from api-user.ts to perform login
            await loginUser(username, password);
            setSuccess(true); // Set success state to true
            setError(null); // Clear error message
            // Redirect to main page upon successful login
            window.location.href = '/';
        } catch (err:any) {
            setError(err.message); // Set error message received from loginUser function
            setSuccess(false); // Set success state to false
        }
    };

    return (
        <div className="mb-3 mb-3-custom-width">
            <h2 className="center2">User Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Username:</label>
                    <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="form-label">Password:</label>
                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary btnsp" type="submit">Login</button>
            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if exists */}
            {success && <div style={{ color: 'green' }}>Login successful!</div>} {/* Display success message if login is successful */}
        </div>
    );
};

export default Login;
