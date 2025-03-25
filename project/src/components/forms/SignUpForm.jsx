import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../store/auth/authSlice";

export default function SignUpForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ עכשיו זה בתוך הקומפוננטה

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');

    // בדיקת אם אחד מהשדות ריק
    if (!username || !password || !email || !phone) {
      setError('יש למלא את כל השדות!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
        phone,
        email
      });

      if (response.status === 201) {
        const userId = response.data.userId;
        dispatch(setUser(userId));
        alert('נרשמת בהצלחה! עכשיו תוכל להתחבר ולעבור לציוד 😁');
        navigate('/HomePage');
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("המשתמש כבר קיים במערכת.");
      } else {
        setError("שגיאה בהרשמה. נסה שוב.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <h2>טופס הרשמה</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          {/* <label>שם משתמש:</label> */}
          <input
            type="text"
            placeholder="הכנס שם משתמש"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          {/* <label>סיסמה:</label> */}
          <input
            type="password"
            placeholder="הכנס סיסמה"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          {/* <label>טלפון:</label> */}
          <input
            type="tel"
            placeholder="הכנס מספר פלאפון"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          {/* <label>אימייל:</label> */}
          <input
            type="email"
            placeholder="הכנס אימייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <br />
        <button onClick={handleRegister} disabled={loading}>
          {loading ? 'טוען...' : 'הירשם'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  );
}
