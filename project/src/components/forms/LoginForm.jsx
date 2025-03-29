import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../../store/auth/authSlice';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper } from '@mui/material';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  let isAdmin = false;

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { username, password });

      if (response.status === 200) {
        const { userId } = response.data;

        if (username === 'admin' && password === '1234567') {
          isAdmin = true;
        }

        dispatch(setUser({ userId, username, isAdmin }));
        alert('כניסה הצליחה!');

        navigate(isAdmin ? '/adminHomePage' : '/homePage');
      }
    } catch (err) {
      console.error(err);
      setError('שם משתמש או סיסמה שגויים.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, textAlign: 'center', marginTop: 8 }}>
        <Typography variant="h5" color="#D81B60" fontWeight="bold" textAlign="center" gutterBottom>
          👶 {<br />}ברוך הבא להתחברות למערכת השאלת עריסות 
        </Typography>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? 'טוען...' : 'התחבר'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2 }}>
          משתמש חדש? <Link to="/signup">הירשם כאן!</Link> 😁
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
      </Paper>
    </Container>
  );
};

export default LoginForm;
