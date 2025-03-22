import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // ✅ Importing necessary routing components
import Equipments from './equipments';


export default function HomePage() {
    return (
        <div>
            <h2>🏠 דף הבית</h2>
            <nav>
                <ul>
                    <li>
                        <Link to="/equipments">📦 ציוד זמין להשאלה</Link>
                    </li>
                    <li>
                        <Link to="/borrowEquipments">📋 הציוד שהשאלתי</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
