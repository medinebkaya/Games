import React from 'react';
import styles from './Styles/Game6.module.css'; // CSS modülünü içe aktar

const Games6 = () => {
    return (
        <div className={styles.container}>
            <h1>Çengel Bulmaca</h1>
            <iframe
                src="https://crosswordlabs.com/embed/2024-08-19-123"
                frameBorder="0"
                title="Çengel Bulmaca"
            ></iframe>
            <div className={styles.footer}>
                <p>Çengel bulmacayı çözün ve keyfini çıkarın!</p>
            </div>
        </div>
    );
};

export default Games6;