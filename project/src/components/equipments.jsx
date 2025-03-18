import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Borrows from "./Borrows"; // ייבוא רכיב ה-Dialog

export default function Equipments() {
    const [equipments, setEquipments] = useState([]); // רשימת הציוד
    const [selectedEquipment, setSelectedEquipment] = useState(null); // ציוד שנבחר להשאלה
    const [showDialog, setShowDialog] = useState(false); // האם להציג את ה-Dialog
    const [borrowDate, setBorrowDate] = useState(''); // תאריך ההשאלה
    const [returnDate, setReturnDate] = useState(''); // תאריך ההחזרה
    const userId = useSelector((state) => state.auth.userId);
    const navigate = useNavigate();

    // פונקציה שבודקת אם התאריך נמצא בתוך חודש מהתאריך הנתון
    const isWithinOneMonth = (date1, date2) => {
        const startDate = new Date(date1);
        const endDate = new Date(date2);

        // חישוב ההפרש בימים
        const diffInDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

        return diffInDays <= 31; // ניתן לשנות בהתאם ללוגיקה הרצויה
    };

    // קריאה ל-API לקבלת הציוד
    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/equipments");
                setEquipments(response.data);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipments();
    }, []);

    // פונקציה לפתיחת הטופס הקופץ
    const openBorrowDialog = (equipment) => {
        setSelectedEquipment(equipment);
        setShowDialog(true);
    };

    // פונקציה לביצוע ההשאלה לאחר אישור
    const borrowEquipment = async () => {
        if (!selectedEquipment || !borrowDate || !returnDate) return;
 // בודק אם התאריך שנבחר נמצא בטווח של חודש מהיום
        const currentDate = new Date().toISOString().split('T')[0]; // התאריך הנוכחי בפורמט yyyy-mm-dd
        const isBorrowDateValid = isWithinOneMonth(currentDate, borrowDate);
        const isReturnDateValid = isWithinOneMonth(currentDate, returnDate);

        if (!isBorrowDateValid || !isReturnDateValid) {
            alert("התאריכים צריכים להיות בתוך חודש מהיום.");
            return;
        }

        try {
            await axios.post("http://localhost:3000/borrow", 
                { 
                    equipmentId: selectedEquipment.id, 
                    borrowDate,
                    returnDate
                }, 
                { headers: { 'user': userId } } // שליחה עם מזהה המשתמש
            );
            alert('הציוד הושאל בהצלחה!');
            setShowDialog(false); // סגירת ה-Dialog לאחר ההשאלה
        } catch (error) {
            console.error("Error borrowing equipment:", error);
        }
    };

    return (
        <div>
            <h2>🛌 ציוד 🛌</h2>
            <div>
                {equipments.length === 0 ? (
                    <p>אין ציוד להציג</p>
                ) : (
                    equipments.map((equipment) => (
                        <div key={equipment.id}>
                            <h3>{equipment.name}</h3>
                            <p>קטגוריה: {equipment.category}</p>
                            <p>סטטוס: {equipment.status}</p>
                            {equipment.imgUri && <img src={equipment.imgUri} alt={equipment.name} />}
                            <button 
                                onClick={() => {
                                    if (equipment.status === 'זמין') {
                                        openBorrowDialog(equipment); 
                                    } else {
                                        alert('הציוד כבר מושאל');
                                    }
                                }}
                            >
                                השאלת המוצר
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* הצגת הטופס הקופץ רק אם showDialog=true */}
            {showDialog && (
                <Borrows 
                    selectedEquipment={selectedEquipment} 
                    onClose={() => setShowDialog(false)} 
                    onBorrow={borrowEquipment} 
                    borrowDate={borrowDate} 
                    setBorrowDate={setBorrowDate} 
                    returnDate={returnDate} 
                    setReturnDate={setReturnDate} 
                />
            )}
        </div>
    );
}
