
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SignIn() {
     const navigate=useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // פונקציה לשליחת הבקשה ל-API
    const handleLogin = async () => {
        setLoading(true); // הצגת סטטוס טעינה
        setError(''); // איפוס שגיאות קודם

        try {
            // שליחה של הבקשה ל-API
            const response = await axios.post('http://localhost:3000/auth/register', { username, password, phone, email });

            // טיפול בתשובה מהשרת
            if (response.status === 200) {
                // אם הכניסה הצליחה, תוכל לבצע שדרוג או מעבר לעמוד אחר
                alert('כניסה הצליחה!');
                // לדוגמה, אם רוצים לשמור את ה- userId
               <Link to='ho'></Link>
                console.log(response.data.userId);
            }
            if(response.status === 409)
            {
               alert("You are already exist") 
               navigate()
            }
        } catch (err) {
            setError('שם משתמש או סיסמה שגויים.');
        } finally {
            setLoading(false); // סיום טעינה
        }
    };
    return (<>
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

            <div>
                <label>טלפון</label>
                <input
                    type="number"
                    placeholder="הכנס מספר פלאפון"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>אימייל:</label>
                <input
                    type="email"
                    placeholder="הכנס אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <button onClick={handleLogin} disabled={loading}>
                {loading ? 'טוען...' : 'הירשם'}
            </button>
        </form>
        {/* הצגת שגיאה אם יש */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>)
}
