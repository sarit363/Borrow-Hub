import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

export default function EditBorrows() { 
    const [newEquipment, setNewEquipment] = useState({
        name: "",
        category: "",
        status: "available",
    });
    const [equipments, setEquipments] = useState([]);
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const userId = useSelector((state) => state.auth.userId);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/admin/equipments");
                setEquipments(response.data);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };

        fetchEquipments();
    }, []);

    const addEquipment = async () => {
        try {
            const headers = {
                'user': isAdmin ? 'admin' : userId.toString(),
            };

            const response = await axios.post("http://localhost:3000/admin/equipments", newEquipment, { headers });
            alert('הציוד נוסף בהצלחה');
            setEquipments([...equipments, response.data]);
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
                    <option value="זמין">available</option>
                    <option value="נשאל">borrow</option>
                </select>
                <button type="button" onClick={addEquipment}>הוסף ציוד</button>
            </form>

            <div>
                <br />
                   { equipments.map((equipment) => (
                        <div key={equipment.id}>
                            <p>{equipment.name} - {equipment.status}</p>
                        </div>
                    ))}
                
            </div>

            <button onClick={() => navigate('/equipments')}>לרשימת הציוד</button>

            <button onClick={() => navigate('/')}>התנתקות </button>
            
            <br />
            <br />
            {isAdmin ? (
                <Link to="/adminHomePage" >
                    <button>📦 חזרה לדף הבית</button>
                </Link>
            ) :
                <Link to="/homePage">
                    <button>📦 חזרה לדף הבית</button>
                </Link>
            }
        </div>
    );
}
