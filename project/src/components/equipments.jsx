


//דף שעוד לא בשימוש !!!!!!!!!!!!!!!!!!!!!!!!!!!










import { useState } from "react";
import axios from "axios";
// import cribs from "./cribsList";
export default function Equipments() {
    const [equipments, setEquipments] = useState([]); // רשימה של ציוד
    const [newEquipment, setNewEquipment] = useState({
        name: "",
        category: "",
        status: "available", // הערך ההתחלתי
    }); // פרטי ציוד חדש

    // פונקציה להוספת ציוד
    const addEquipment = async () => {
        const response = await axios.post("http://localhost:3000/admin/equipments", newEquipment);
        setEquipments([...equipments, response.data]); // הוספת הציוד החדש לרשימה
        setNewEquipment({ name: "", category: "", status: "available" }); // איפוס שדות לאחר ההוספה
    };

    // פונקציות שמבצעות עדכון של הערכים ב-newEquipment
    const handleInputChange = (e, field) => {
        setNewEquipment({ ...newEquipment, [field]: e.target.value });
    };

    return (
        <div>
            <h2>🛌ציוד🛌</h2>

            {/* טופס להוספת ציוד */}
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
                    <option value="available">זמין</option>
                    <option value="borrowed">נשאל</option>
                </select>
                <button type="button" onClick={addEquipment}>הוסף ציוד</button>
            </form>

            <div>
                {equipments.map((equipment) => (
                    <div key={equipment.id}>
                        <p>{equipment.name} - {equipment.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};