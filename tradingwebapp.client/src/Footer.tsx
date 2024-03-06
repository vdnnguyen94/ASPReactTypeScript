import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer>
            <p>
                <span className="note">Note:</span>: AzureSQL may be paused, please wait for 2-3 minutes. If not, please use an application developed by Flask.
            </p>
            <nav>
                <ul>
                    <a href="https://vannguyentrading.dev/">Trading Web</a>
                </ul>
            </nav>
        </footer>
    );
};

export default Footer;
