import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // ✅ Importing necessary routing components
import Equipments from './equipments';


export default function HomePage() {
    return (
        <Router> {/* Make sure the Router wraps your Routes */}
            <div>
                <h1>מערכת השאלת ציוד</h1>

                {/* Navigation Links */}
                <nav>
                    <ul>
                        <li>
                            <Link to="/equipments">ציוד</Link>
                        </li>
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
        </Router>
    );
}
