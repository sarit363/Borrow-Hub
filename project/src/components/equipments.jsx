import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import Borrows from "./borrows";
import { useNavigate } from 'react-router-dom';


export default function Equipments() {
    const [equipments, setEquipments] = useState([]); // רשימה של ציוד
    const [newEquipment, setNewEquipment] = useState({
        name: "",
        category: "",
        status: "זמין", // הערך ההתחלתי
    }); // פרטי ציוד חדש

    const userId = useSelector((state) => state.auth.userId); // שליפת מזהה המשתמש
    const isAdmin = useSelector((state) => state.auth.isAdmin); // שליפת אם המשתמש הוא מנהל
    const navigate = useNavigate();
    // קריאה ל-API לקבלת הציוד
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/admin/equipments");
                setEquipments(response.data); // עדכון הציוד בסטייט
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipments(); // מבצע קריאה בעת טעינת העמוד
    }, []); // הפעולה תקרה רק פעם אחת כאשר הרכיב ייטען

    // פונקציה להוספת ציוד
    const addEquipment = async () => {
        try {
            const headers = {
                'user': isAdmin ? 'admin' : userId, // אם מדובר במנהל נשלח 'admin', אחרת נשלח את מזהה המשתמש
            };
            const response = await axios.post("http://localhost:3000/admin/equipments", newEquipment, { headers });
            setEquipments([...equipments, response.data]); // הוספת הציוד החדש לרשימה
            setNewEquipment({ name: "", category: "", status: "הפריט זמין" }); // איפוס שדות לאחר ההוספה
        } catch (error) {
            console.error("Error adding equipment:", error);
        }
    };


    // פונקציות שמבצעות עדכון של הערכים ב-newEquipment
    const handleInputChange = (e, field) => {
        setNewEquipment({ ...newEquipment, [field]: e.target.value });
    };

    return (
        <div>
            <h2>🛌ציוד🛌</h2>
            {console.log(isAdmin)}
            {/* טופס להוספת ציוד */}
            {isAdmin && (
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
            )}
            <div>
                {equipments.length === 0 ? (
                    <p>אין ציוד להציג</p>
                ) : (
                    equipments.map((equipment) => (
                        <div key={equipment.id}>
                            <p>{equipment.name} - {equipment.status}</p>
                            <button onClick={() => navigate('/borrows')}>השאלת המוצר</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
