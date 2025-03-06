import React, { useState } from 'react';
import axios from 'axios';
import HomePage from './homePage';
import SignIn from './signIn';


const Login = () => {
  // סטייט לשם משתמש, סיסמה וסטטוס טעינה או שגיאה
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
//   const [isAdmin, setIsAdmin] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // פונקציה לשליחת הבקשה ל-API
  const handleLogin = async () => {
    setLoading(true); // הצגת סטטוס טעינה
    setError(''); // איפוס שגיאות קודם

    try {
      // שליחה של הבקשה ל-API
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      // טיפול בתשובה מהשרת
      if (response.status === 200) {
        // אם הכניסה הצליחה, תוכל לבצע שדרוג או מעבר לעמוד אחר
        alert('כניסה הצליחה!');
        // לדוגמה, אם רוצים לשמור את ה- userId
        <HomePage/>
        console.log(response.data.userId);
      }
    } catch (err) {
      setError('שם משתמש או סיסמה שגויים.');
    } finally {
      setLoading(false); // סיום טעינה
    }
  };

  return (
    <div>
      <h2>טופס כניסה</h2>

      {/* טופס כניסה */}
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
      <p>משתמש חדש?? - הירשם!!😁</p>
      <SignIn/>
      {/* הצגת שגיאה אם יש */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;