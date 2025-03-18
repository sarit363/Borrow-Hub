import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm';
import HomePage from './components/HomePage';
import SignUpForm from './components/forms/SignUpForm';
import Equipments from './components/equipments'; // ✅ וודא שהנתיב לקובץ נכון
import EditBorrows from './components/editBorrows'; // ✅ הוסף את דף ניהול הציוד למנהל

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> {/* ✅ דף התחברות */}
        <Route path="/home" element={<HomePage />} /> {/* ✅ דף הבית */}
        <Route path="/signup" element={<SignUpForm />} /> {/* ✅ דף הרשמה */}
        
        <Route path="/equipments" element={<Equipments />} /> {/* ✅ דף הציוד */}
        <Route path="/editborrows" element={<EditBorrows />} /> {/* ✅ דף ניהול ציוד למנהל */}
      </Routes>
    </Router>
  );
}

export default App;