import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Borrows from "./Borrows"; // קומפוננטה שמנהלת את תהליך ההשאלה

export default function Equipments() {
    const [equipments, setEquipments] = useState([]); // רשימת הציוד
    const [selectedEquipment, setSelectedEquipment] = useState(null); // ציוד שנבחר
    const [showDialog, setShowDialog] = useState(false); // האם להציג את הדיאלוג
    const [updatedName, setUpdatedName] = useState(''); // שם ציוד מעודכן
    const [updatedCategory, setUpdatedCategory] = useState(''); // קטגוריה מעודכנת
    const [updatedStatus, setUpdatedStatus] = useState(''); // סטטוס מעודכן
    const [startDate, setStartDate] = useState(''); // תאריך השאלה
    const [endDate, setEndDate] = useState(''); // תאריך החזרה
    const [dialogType, setDialogType] = useState(null); // סוג הדיאלוג (השאלה / עריכה)

    const userId = useSelector((state) => state.auth.userId); // מזהה המשתמש מ-Redux
    const isAdmin = useSelector((state) => state.auth.isAdmin);  // בדיקת אם המשתמש הוא מנהל
    const dispatch = useDispatch();  // יצירת dispatch לשימוש עם Redux

    // פונקציה לבדיקה שהתאריך נמצא בתוך חודש מהיום
    const isWithinOneMonth = (currentDate, targetDate) => {
        const current = new Date(currentDate);
        const target = new Date(targetDate);
        const oneMonthLater = new Date(current);
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
        return target >= current && target <= oneMonthLater;
    };

    // פתיחת הדיאלוג להשאלת ציוד
    const openBorrowDialog = (equipment) => {
        setSelectedEquipment(equipment);
        setDialogType("borrow");
        setShowDialog(true);
    };

    // פתיחת הדיאלוג לעדכון ציוד
    const openUpdateDialog = (equipment) => {
        setSelectedEquipment(equipment);
        setUpdatedName(equipment.name);
        setUpdatedCategory(equipment.category);
        setUpdatedStatus(equipment.status);
        setDialogType("update");
        setShowDialog(true);
    };

    const deleteEquipment = async (equipmentId) => {
        try {
            await axios.delete(`http://localhost:3000/admin/equipments/${equipmentId}`, { headers: { user: 'admin' } });
            setEquipments(prevEquipments => prevEquipments.filter(equipment => equipment.id !== equipmentId));
            alert("הציוד נמחק בהצלחה!");
        } catch (error) {
            console.error("Error deleting equipment:", error);
            alert("אירעה שגיאה במחיקת הציוד.");
        }
    };


    // פונקציה לעדכון הציוד
    const updateEquipment = async () => {
        if (!isAdmin) {
            alert("אין לך הרשאות לעדכן ציוד.");
            return;
        }

        const updatedEquipment = {
            id: selectedEquipment.id,
            name: updatedName || selectedEquipment.name,
            category: updatedCategory || selectedEquipment.category,
            status: updatedStatus || selectedEquipment.status,
            userId: userId
        };

        try {
            await axios.put(
                `http://localhost:3000/admin/equipments/${updatedEquipment.id}`,
                updatedEquipment,
                { headers: { user: 'admin' } }
            );
            setEquipments(prevEquipments => prevEquipments.map(equipment =>
                equipment.id === updatedEquipment.id ? updatedEquipment : equipment
            ));
            alert("הציוד עודכן בהצלחה!");
            setShowDialog(false);
        } catch (error) {
            console.error("Error updating equipment:", error);
            alert("אירעה שגיאה בעדכון הציוד.");
        }
    };

    // שליחת בקשה להשאלת הציוד
    const borrowEquipment = async () => {
        if (!selectedEquipment || !startDate || !endDate) return;
        const currentDate = new Date().toISOString().split('T')[0];
        if (!isWithinOneMonth(currentDate, startDate) || !isWithinOneMonth(currentDate, endDate)) {
            alert("התאריכים צריכים להיות בתוך חודש מהיום.");
            return;
        }
        try {
           const response= await axios.post("http://localhost:3000/borrow", {
                equipmentId: selectedEquipment.id,
                startDate,
                endDate,
                userId: userId
            }, { headers: { 'user': userId } });
            // // dispatch(setBorrowDates({ startDate, endDate }));
            // setEquipments(prevEquipments => prevEquipments.map(eq =>
            //     eq.id === selectedEquipment.id ? { ...eq, status: 'נשאל' } : eq
            // ));
            alert('הבקשה התקבלה! אנא המתן לאישור המערכת.');
            setShowDialog(false);
        } catch (error) {
            console.error("Error borrowing equipment:", error);
        }
    };

    useEffect(() => {
        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/equipments");
                setEquipments(response.data.map(equipment => ({
                    ...equipment,
                    // status: equipment.status === 'borrowed' ? 'נשאל' : 'זמין'
                })));
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };
        fetchEquipments();
    }, []);

    return (
        <div>
            <h2>🛌 ציוד 🛌</h2>
            <div>
                {equipments.filter(equipment => equipment.status === 'available').length === 0 ? (
                    <p>אין ציוד זמין להציג</p>
                ) : (
                    equipments.filter(equipment => equipment.status === 'available').map((equipment) => (
                        <div key={equipment.id}>
                            <h3>{equipment.name}</h3>
                            <p>קטגוריה: {equipment.category}</p>
                            <p>סטטוס: {equipment.status}</p>
                            {equipment.imgUri && <img src={equipment.imgUri} alt={equipment.name} />}
                            <button onClick={() => openBorrowDialog(equipment)}>השאלת המוצר</button>
                            {isAdmin && <button onClick={() => openUpdateDialog(equipment)}>עדכון ציוד</button>}
                            {isAdmin && (
                                <button onClick={() => deleteEquipment(equipment.id)}>מחיקת ציוד</button>
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
            {/* {showDialog && dialogType === "update" && selectedEquipment && (
                <div className="dialog">
                    <h3>עדכון ציוד: {selectedEquipment.name}</h3>
                    <input type="text" value={updatedName} onChange={(e) => setUpdatedName(e.target.value)} />
                    <input type="text" value={updatedCategory} onChange={(e) => setUpdatedCategory(e.target.value)} />
                    <input type="text" value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)} />
                    <button onClick={updateEquipment}>עדכן ציוד</button>
                    <button onClick={() => setShowDialog(false)}>סגור</button>
                </div>
            )} */}
            {showDialog && dialogType === "borrow" && selectedEquipment && (
                <Borrows
                    selectedEquipment={selectedEquipment}
                    onClose={() => setShowDialog(false)}
                    onBorrow={borrowEquipment}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                />
            )}
        </div>
    );
}