import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../store/auth/authSlice';
import { Link } from 'react-router-dom'; // ✅ הוספת ייבוא של Link

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ חייב להיות בתוך הקומפוננטה

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      if (response.status === 200) {
        const userId = response.data.userId; // בהנחה שהשרת מחזיר userId
        dispatch(setUser(userId)); // ✅ שמירת userId ב-Redux
        alert('כניסה הצליחה!');
        navigate('/equipments'); // ✅ הפניה לדף רשימת הציוד
      }
    } catch (err) {
      setError('שם משתמש או סיסמה שגויים.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>טופס כניסה</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>שם משתמש:</label>
          <input
            type="text"
            placeholder="הכנס שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>סיסמה:</label>
          <input
            type="password"
            placeholder="הכנס סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? 'טוען...' : 'התחבר'}
        </button>
      </form>

      <p>משתמש חדש?? <Link to="/signup">הירשם כאן!</Link> 😁</p> {/* ✅ הקישור חזר עם האימוג'י */}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default LoginForm;
