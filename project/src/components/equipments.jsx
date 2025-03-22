import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Borrows from "./Borrows"; // ייבוא רכיב ה-Dialog

export default function Equipments() {
    const [equipments, setEquipments] = useState([]); // רשימת הציוד
    const [selectedEquipment, setSelectedEquipment] = useState(null); // ציוד שנבחר להשאלה
    const [showDialog, setShowDialog] = useState(false); // האם להציג את ה-Dialog
    const [updatedName, setUpdatedName] = useState(''); // שם ציוד מעודכן
    const [updatedCategory, setUpdatedCategory] = useState(''); // קטגוריה מעודכנת
    const [updatedStatus, setUpdatedStatus] = useState(''); // סטטוס מעודכן
    const [borrowDate, setBorrowDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [dialogType, setDialogType] = useState(null);

    const userId = useSelector((state) => state.auth.userId);
    const isAdmin = useSelector((state) => state.auth.isAdmin);  // בדיקת אם המשתמש הוא מנהל
    const navigate = useNavigate();

    // פונקציה שבודקת אם התאריך הנתון נמצא בתוך חודש מהתאריך הנוכחי
    const isWithinOneMonth = (currentDate, targetDate) => {
        const current = new Date(currentDate);
        const target = new Date(targetDate);
        const oneMonthLater = new Date(current);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        return target >= current && target <= oneMonthLater;
    };

    const openBorrowDialog = (equipment) => {
        setSelectedEquipment(equipment);
        setDialogType("borrow"); // סוג הדיאלוג להשאלה
        setShowDialog(true);
    };

    const openUpdateDialog = (equipment) => {
        setSelectedEquipment(equipment);
        setUpdatedName(equipment.name);
        setUpdatedCategory(equipment.category);
        setUpdatedStatus(equipment.status);
        setDialogType("update"); // סוג הדיאלוג לעדכון
        setShowDialog(true);
    };

    // פונקציה לעדכון הציוד
    const updateEquipment = async () => {
        if (!isAdmin) {  // רק למנהל יש גישה לעדכון ציוד
            alert("אין לך הרשאות לעדכן ציוד.");
            return;
        }

        // אם יש שדות ריקים, נעדכן את הציוד עם הערכים הקיימים
        const updatedEquipment = {
            id: selectedEquipment.id,
            name: updatedName || selectedEquipment.name,
            category: updatedCategory || selectedEquipment.category,
            status: updatedStatus || selectedEquipment.status,
        };

        try {
            // שליחת הבקשה ל-API לעדכון הציוד עם הוספת header "user" עם הערך "admin"
            await axios.put(
                `http://localhost:3000/admin/equipments/${updatedEquipment.id}`,
                updatedEquipment,
                {
                    headers: {
                        user: 'admin'
                    }
                }
            );
            setEquipments(prevEquipments => prevEquipments.map(equipment =>
                equipment.id === updatedEquipment.id ? updatedEquipment : equipment
            ));
            alert("הציוד עודכן בהצלחה!");
            setShowDialog(false); // סגירת הדיאלוג אחרי העדכון
        } catch (error) {
            console.error("Error updating equipment:", error);
            alert("אירעה שגיאה בעדכון הציוד.");
        }
    };

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

                setEquipments(updatedEquipments);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipments();
    }, []);


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
                    returnDate,
                    userId: userId // הוספת מזהה המשתמש
                },
                { headers: { 'user': userId } } // שליחה עם מזהה המשתמש
            );

            // עדכון הסטטוס של הציוד ל-"נשאל"
            setEquipments(prevEquipments =>
                prevEquipments.map(eq =>
                    eq.id === selectedEquipment.id ? { ...eq, status: 'נשאל' } : eq
                )
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
                {equipments.filter(equipment => equipment.status === 'זמין').length === 0 ? (
                    <p>אין ציוד זמין להציג</p>
                ) : (
                    equipments
                        .filter(equipment => equipment.status === 'זמין')
                        .map((equipment) => (
                            <div key={equipment.id}>
                                <h3>{equipment.name}</h3>
                                <p>קטגוריה: {equipment.category}</p>
                                <p>סטטוס: {equipment.status}</p>
                                {equipment.imgUri && <img src={equipment.imgUri} alt={equipment.name} />}

                                <button onClick={() => openBorrowDialog(equipment)}>
                                    השאלת המוצר
                                </button>

                                {/* הצגת כפתור עדכון רק אם המשתמש הוא מנהל */}
                                {isAdmin && (
                                    <button onClick={() => openUpdateDialog(equipment)}>
                                        עדכון ציוד
                                    </button>
                                )}
                            </div>
                        ))
                )}
            </div>

            {/* הצגת הטופס הקופץ רק אם showDialog=true */}
            {showDialog && dialogType === "update" && selectedEquipment && (
                <div className="dialog">
                    <div className="dialog-content">
                        <h3>עדכון ציוד: {selectedEquipment.name}</h3>

                        <label>שם הציוד:</label>
                        <input
                            type="text"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                        />

                        <label>קטגוריה:</label>
                        <input
                            type="text"
                            value={updatedCategory}
                            onChange={(e) => setUpdatedCategory(e.target.value)}
                        />

                        <label>סטטוס:</label>
                        <input
                            type="text"
                            value={updatedStatus}
                            onChange={(e) => setUpdatedStatus(e.target.value)}
                        />

                        <button onClick={updateEquipment}>עדכן ציוד</button>
                        <button onClick={() => setShowDialog(false)}>סגור</button>
                    </div>
                </div>
            )}

            {/* הצגת הטופס הקופץ רק אם showDialog=true */}
            {showDialog && dialogType === "borrow" && selectedEquipment && (
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
