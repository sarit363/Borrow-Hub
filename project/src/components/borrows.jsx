import { useState } from 'react';
import './Borrows.css'; // ✅ חיבור קובץ העיצוב

export default function Borrows({ selectedEquipment, onClose, onBorrow }) {
   const [borrowDate, setBorrowDate] = useState('');

   const handleSubmit = () => {
      if (borrowDate) {
         onBorrow(borrowDate); // קריאה לפונקציה שמבצעת את ההשאלה בשרת
      } else {
         alert('יש לבחור תאריך');
      }
   };

   return (
      <div className="dialog">
         <div className="dialog-content">
            <h3>השאלת ציוד: {selectedEquipment.name}</h3>
            <p>קטגוריה: {selectedEquipment.category}</p>
            <p>סטטוס: {selectedEquipment.status}</p>

            <label>בחר תאריך השאלה:</label>
            <input
               type="date"
               value={borrowDate}
               onChange={(e) => setBorrowDate(e.target.value)}
            />

            <label>בחר תאריך החזרה:</label>
            <input
               type="date"
               value={borrowDate}
               onChange={(e) => setBorrowDate(e.target.value)}
            />

            <button className="approve-btn" onClick={handleSubmit}>אשר השאלה</button>
            <button className="close-btn" onClick={onClose}>סגור</button>
         </div>
      </div>
   );
}