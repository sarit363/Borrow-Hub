import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // ✅ Importing necessary routing components
import { Button, Typography } from '@mui/material'; // ✅ Importing MUI components
import Equipments from './equipments'; // ✅ Importing Equipments component

export default function HomePage() {
    return (
        <div style={styles.container}>
            <Typography variant="h4" gutterBottom>
                🏠 דף הבית
            </Typography>
            <nav>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/equipments" style={styles.link}>
                            <Button variant="contained" color="primary" style={styles.button}>
                                📦 ציוד זמין להשאלה
                            </Button>
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/borrowEquipments" style={styles.link}>
                            <Button variant="contained" color="secondary" style={styles.button}>
                                📋 הציוד שהשאלתי
                            </Button>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        textAlign: 'center',
    },
    navList: {
        listStyle: 'none',
        padding: 0,
    },
    navItem: {
        marginBottom: '1rem',
    },
    link: {
        textDecoration: 'none', 
    },
    button: {
        fontSize: '1rem',
    },
};