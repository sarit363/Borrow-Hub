import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography } from '@mui/material';

export default function AdminHomePage() {
    return (
        <div style={styles.container}>
            <Typography variant="h4" gutterBottom>
                🏠 דף הבית למנהל
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
                    <li style={styles.navItem}>
                        <Link to="/editBorrows" style={styles.link}>
                            <Button variant="contained" color="success" style={styles.button}>
                                ✏️ ניהול השאלות
                            </Button>
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/adminBorrow" style={styles.link}>
                            <Button variant="contained" color="warning" style={styles.button}>
                                ⚙️ פאנל ניהול
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