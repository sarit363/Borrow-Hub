import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // ✅ ייבוא useNavigate


/*
 if (audioRef.current) {
      audioRef.current.play(); // הפעלת השמע באופן אוטומטי כשנכנסים לאתר
    }
*/
export default function EditBorrows() { 
    const [newEquipment, setNewEquipment] = useState({
        name: "",
        category: "",
        status: "זמין",
    });
    const [equipments, setEquipments] = useState([]); // רשימת ציוד
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const userId = useSelector((state) => state.auth.userId);
    const navigate = useNavigate(); // ✅ הוספנו את ה-Navigate כדי להעביר את המשתמש

    // קריאה ל-API לקבלת הציוד ולהצגת הרשימה
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/admin/equipments");
                setEquipments(response.data);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };

        fetchEquipments(); // מבצע קריאה בעת טעינת העמוד
    }, []);

    // פונקציה להוספת ציוד
    const addEquipment = async () => {
        // if (!isAdmin) {
        //     alert("אין לך הרשאות להוסיף ציוד.");
        //     return;
        // }

        try {
            const headers = {
                'user': isAdmin ? 'admin' : userId.toString(),
            };

            const response = await axios.post("http://localhost:3000/admin/equipments", newEquipment, { headers });
            alert('הציוד נוסף בהצלחה');
            setEquipments([...equipments, response.data]);  // עדכון הרשימה עם הציוד החדש
            setNewEquipment({ name: "", category: "", status: "זמין" });
        } catch (error) {
            if (error.response) {
                console.error("Error adding equipment:", error.response.data);
                alert("הייתה בעיה בהוספת הציוד. נסה שוב מאוחר יותר.");
            } else {
                console.error("Error adding equipment:", error.message);
                alert("שגיאה בחיבור לשרת. נסה שוב מאוחר יותר.");
            }
        }
    };

    const handleInputChange = (e, field) => {
        setNewEquipment({ ...newEquipment, [field]: e.target.value });
    };

    return (
        <div>
            <h2>הוסף ציוד חדש</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    placeholder="שם ציוד"
                    value={newEquipment.name}
                    onChange={(e) => handleInputChange(e, "name")}
                />
                <input
                    type="text"
                    placeholder="קטגוריה"
                    value={newEquipment.category}
                    onChange={(e) => handleInputChange(e, "category")}
                />
                <select
                    value={newEquipment.status}
                    onChange={(e) => handleInputChange(e, "status")}
                >
                    <option value="זמין">זמין</option>
                    <option value="נשאל">נשאל</option>
                </select>
                <button type="button" onClick={addEquipment}>הוסף ציוד</button>
            </form>

            {/* הצגת רשימת הציוד */}
            <div>
                {/* <h3>ציוד זמין:</h3>
                {equipments.length === 0 ? (
                    <p>אין ציוד להציג</p>
                ) : ( */}
                <br />
                   { equipments.map((equipment) => (
                        <div key={equipment.id}>
                            <p>{equipment.name} - {equipment.status}</p>
                        </div>
                    ))}
                
            </div>

            {/* כפתור חזרה */}
            <button onClick={() => navigate('/equipments')}>לרשימת הציוד</button> {/* כפתור חזרה לדף הציוד */}

            {/* כפתור חזרה להתחברות */}
            <button onClick={() => navigate('/')}>התנתקות </button> {/* כפתור חזרה לעמוד ההתחברות */}
        </div>
    );
}
