import { useSelector } from 'react-redux';
import { useState, useEffect } from "react";
import axios from "axios";

const BorrowedEquipment = () => {
    const userId = useSelector((state) => state.auth.userId); // קבלת מזהה המשתמש
    const [equipments, setEquipments] = useState([]); // רשימת הציוד

    // קריאה ל-API לקבלת הציוד
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/equipments");

                // עדכון הסטטוס של הציוד
                const updatedEquipments = response.data.map(equipment => ({
                    ...equipment,
                    status: equipment.status === 'borrowed' ? 'נשאל' : 'זמין'
                }));

                console.log("Equipments from API:", response.data);
                setEquipments(updatedEquipments);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipments();
    }, []);

    // סינון הציוד לפי המשתמש
    const borrowedItems = equipments.filter(equipment => equipment.userId === userId);
    console.log(borrowedItems);


    const handleReturnEquipment = async (id) => {
        try {
            // שליחה לשרת כדי לעדכן את הסטטוס ל-"זמין"
            await axios.put(`http://localhost:3000/equipments/${id}`, {
                status: 'available',  // עדכון הסטטוס ל"זמין"
                userId: null,      // עדכון המזהה של המשתמש ל-null
            });

            // עדכון הסטטוס בצד הלקוח
            setEquipments(prevEquipments =>
                prevEquipments.map(eq =>
                    eq.id === id ? { ...eq, status: 'זמין', userId: null } : eq
                )
            );

            // קריאה מחדש ל-API כדי לרענן את רשימת הציוד המושאל
            fetchEquipments();  // קריאה מחדש ל-API כדי לעדכן את הציוד

            alert("הציוד הוחזר בהצלחה!");
        } catch (error) {
            console.error("Error returning equipment:", error);
            alert("אירעה שגיאה בהחזרת הציוד.");
        }
    };

    return (
        <div>
            <h2>📋 הציוד שהשאלת</h2>
            {borrowedItems.length === 0 ? (
                <p>לא השאלת עדיין ציוד</p>
            ) : (
                borrowedItems.map(equipment => (
                    <div key={equipment.id}>
                        <h3>{equipment.name}</h3>
                        <p>קטגוריה: {equipment.category}</p>
                        {equipment.imgUri && <img src={equipment.imgUri} alt={equipment.name} />}
                        <button onClick={() => handleReturnEquipment(equipment.id)}>
                            החזרת ציוד
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default BorrowedEquipment;
