import React from 'react';
import './Styles/Game6.css'; // Make sure to create this CSS file

const Games6 = () => {
    return (
        <div className="container">
            <h1>Çengel Bulmaca</h1>
            <iframe
                src="https://crosswordlabs.com/embed/2024-08-19-123"
                frameBorder="0"
                title="Çengel Bulmaca"
            ></iframe>
            <div className="footer">
                <p>Çengel bulmacayı çözün ve keyfini çıkarın!</p>
            </div>
        </div>
    );
};

export default Games6;