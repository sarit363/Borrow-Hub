import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/forms/LoginForm';  // ✅ יש לוודא שזו עדיין הקומפוננטה הנכונה
import HomePage from './components/HomePage';  // ✅ דף הבית נשאר כמו שהיה
import SignUpForm from './components/forms/SignUpForm';  // ✅ עדכון ל- SignUpForm

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} /> {/* ✅ דף התחברות */}
        <Route path="/home" element={<HomePage />} /> {/* ✅ דף הבית */}
        <Route path="/signup" element={<SignUpForm />} /> {/* ✅ דף הרשמה */}
      </Routes>
    </Router>
  );
}

export default App;
