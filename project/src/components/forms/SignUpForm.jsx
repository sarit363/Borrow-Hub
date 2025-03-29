import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../store/auth/authSlice";
import { Container, Paper, TextField, Button, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

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
        alert('נרשמת בהצלחה! 😁');
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
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center", marginTop: 8 }}>
      <Typography variant="h5" color="#D81B60" fontWeight="bold" textAlign="center" gutterBottom>
          👶 {<br />}ברוך הבא להצטרפות למערכת השאלת עריסות 
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
          <TextField
            fullWidth
            label="שם משתמש"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="סיסמה"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="טלפון"
            type="tel"
            variant="outlined"
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="אימייל"
            type="email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? "טוען..." : "הירשם"}
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          כבר יש לך חשבון? <Link to="/login">התחבר כאן!</Link> 😃
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </Container>
  );
}
