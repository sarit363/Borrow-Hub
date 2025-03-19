import { useState } from 'react';
import './Borrows.css';

export default function Borrows({ selectedEquipment, onClose, onBorrow, borrowDate, setBorrowDate, returnDate, setReturnDate }) {
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
                    value={returnDate} 
                    onChange={(e) => setReturnDate(e.target.value)} 
                />

                <button className="approve-btn" onClick={onBorrow}>אשר השאלה</button>
                <button className="close-btn" onClick={onClose}>סגור</button>
            </div>
        </div>
    );
}
