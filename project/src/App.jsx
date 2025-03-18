import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm';
import HomePage from './components/HomePage';
import SignUpForm from './components/forms/SignUpForm';
import Equipments from './components/equipments'; // ✅ וודא שהנתיב לקובץ נכון
import Borrows from './components/borrows';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> {/* ✅ דף התחברות */}
        <Route path="/home" element={<HomePage />} /> {/* ✅ דף הבית */}
        <Route path="/signup" element={<SignUpForm />} /> {/* ✅ דף הרשמה */}
        <Route path="/borrows" element={<Borrows />} /> {/* ✅ דף השאלות */}
        <Route path="/equipments" element={<Equipments />} /> {/* ✅ דף הציוד נוסף */}
      </Routes>
    </Router>
  );
}

export default App;
