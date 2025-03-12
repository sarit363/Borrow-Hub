import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // ✅ Importing necessary routing components
import Equipments from './equipments';
import Borrows from './borrows';

export default function HomePage() {
    return (
        <div>
            <h1>מערכת השאלת ציוד</h1>

            {/* Navigation Links */}
            <nav>
                <ul>
                    <li>
                        <Link to="/equipments">ציוד</Link>
                    </li>
                    {/* <li>
                        <Link to="/users">משתמשים</Link>
                    </li> */}
                    <li>
                        <Link to="/borrows">השאלות</Link>
                    </li>
                </ul>
            </nav>

            {/* Routing for Equipments and Borrows */}
            <Routes>
                <Route path="/equipments" element={<Equipments />} />
                <Route path="/borrows" element={<Borrows />} />
            </Routes>
        </div>
    );
}
