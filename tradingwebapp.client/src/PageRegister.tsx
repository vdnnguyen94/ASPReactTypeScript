import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState(''); // State for username input
    const [password, setPassword] = useState(''); // State for password input
    const [confirmPassword, setConfirmPassword] = useState(''); // State for confirm password input
    const [error, setError] = useState(''); // State for error message
    const [success, setSuccess] = useState(false); // State to track successful registration
    const navigate = useNavigate(); // Hook to manage navigation

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        setError(''); // Clear any previous error messages

        // Check if username is at least 6 characters long
        if (username.length < 6) {
            setError("Username must be at least 6 characters long");
            return;
        }

        // Check if password is at least 6 characters long
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }
        // Check if password and confirm password match
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        try {
            const response = await axios.post('/api/User/Register', {
                username,
                password,
                confirmPassword,
            }); // Send registration data to the server
            console.log(response.data); // Log response data from the server
            setSuccess(true); // Set success state to true
            window.alert('Registration successful!');
            navigate('/login'); // Navigate to login page
        } catch (err: any) {
            setError(err.response?.data || 'An unknown error occurred'); // Display error message from the server
        }
    };

    return (
        <div className="mb-3 mb-3-custom-width">
            <h2 className="center2">Account Registration</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="form-label">Username:</label>
                    <input className="form-control" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div>
                    <label className="form-label">Password:</label>
                    <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <label className="form-label">Confirm Password:</label>
                    <input className="form-control" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button className="btn btn-primary btnsp" type="submit">Register</button>


            </form>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error message if exists */}
            {success && <div style={{ color: 'green' }}>Registration successful!</div>} {/* Display success message if registration is successful */}
        </div>
    );
};

export default RegistrationForm;
