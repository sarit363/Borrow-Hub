import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminBorrows
() {
  const [borrows, setBorrows] = useState([]);
  const [users, setUsers] = useState([]);
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    fetchBorrows();
    fetchUsers();
    fetchEquipments();
  }, []);

  const fetchBorrows = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/borrows', {
        headers: { user: 'admin' },
      });
      setBorrows(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (error) {
      console.error('⚠️ Error fetching borrows:', error);
      setBorrows([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3000/admin/users', {
        headers: { user: 'admin' },
      });
      setUsers(res.data);
    } catch (error) {
      console.error('⚠️ Error fetching users:', error);
    }
  };

  const fetchEquipments = async () => {
    try {
      const res = await axios.get('http://localhost:3000/equipments');
      setEquipments(res.data);
    } catch (error) {
      console.error('⚠️ Error fetching equipments:', error);
    }
  };

  const approveBorrow = async (borrowId, endDate) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/borrow/${borrowId}`,
        { status: 'borrowed', endDate },
        { headers: { user: 'admin' } }
      );
      alert('✅ ההשאלה אושרה בהצלחה!');
      fetchBorrows();
    } catch (error) {
      console.error('⚠️ Error approving borrow:', error);
      alert('❌ שגיאה באישור ההשאלה.');
    }
  };

  const rejectBorrow = async (borrowId) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/borrow/${borrowId}`,
        { status: 'rejected' },
        { headers: { user: 'admin' } }
      );
      alert('❌ ההשאלה נדחתה בהצלחה!');
      fetchBorrows();
    } catch (error) {
      console.error('⚠️ Error rejecting borrow:', error);
      alert('❌ שגיאה בדחיית ההשאלה.');
    }
  };

  const extendBorrow = async (borrowId) => {
    const newEndDate = prompt('📅 הכנס תאריך חדש בפורמט YYYY-MM-DD:');
    if (!newEndDate) {
      alert('⚠️ לא הוזן תאריך חדש');
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/admin/borrow/${borrowId}`,
        { status: 'borrowed', endDate: newEndDate },
        { headers: { user: 'admin' } }
      );
      alert('⏳ ההשאלה הוארכה בהצלחה!');
      fetchBorrows();
    } catch (error) {
      console.error('⚠️ Error extending borrow:', error);
      alert('❌ שגיאה בהארכת ההשאלה.');
    }
  };

  const returnBorrow = async (borrowId) => {
    try {
      await axios.put(
        `http://localhost:3000/admin/borrow/${borrowId}/return`,
        {},
        { headers: { user: 'admin' } }
      );
      alert('🔄 הפריט סומן כהוחזר בהצלחה!');
      fetchBorrows();
    } catch (error) {
      console.error('⚠️ Error returning borrow:', error);
      alert('❌ שגיאה בסימון הפריט כהוחזר.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📋 כל ההשאלות הפעילות</h1>

      <button
        onClick={fetchBorrows}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        🔄 רענן נתונים
      </button>

      {borrows.length === 0 ? (
        <p>אין כרגע השאלות פעילות.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ width: '100%', textAlign: 'center' }}
        >
          <thead>
            <tr>
              <th>מספר השאלה</th>
              <th>שם משתמש</th>
              <th>מייל</th>
              <th>טלפון</th>
              <th>פריט שהושאל</th>
              <th>תאריך התחלה</th>
              <th>תאריך סיום</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {borrows.map((borrow) => {
              const user = users.find((u) => u.id === borrow.userId) || {};
              const equipment = equipments.find((eq) => eq.id === borrow.equipmentId) || {};

              return (
                <tr key={borrow.id}>
                     <td>{borrow.id}</td>
                 <td>{user ? user.username : 'לא נמצא'}</td>
                   <td>{user ? user.email : 'לא נמצא'}</td>
                   <td>{user ? user.phone : 'לא נמצא'}</td>
                   <td>{equipment ? equipment.name : 'לא נמצא'}</td>
                   <td>{borrow.startDate}</td>
                   <td>{borrow.endDate}</td>
                   <td>{borrow.status}</td>
                  <td>
                    <button
                      onClick={() => approveBorrow(borrow.id, borrow.endDate)}
                      style={{
                        margin: '0.25rem',
                        backgroundColor: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✅ אשר
                    </button>

                    <button
                      onClick={() => rejectBorrow(borrow.id)}
                      style={{
                        margin: '0.25rem',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      ❌ דחה
                    </button>

                    {borrow.status === 'borrowed' && (
                      <>
                        <button
                          onClick={() => extendBorrow(borrow.id)}
                          style={{
                            margin: '0.25rem',
                            backgroundColor: '#2196f3',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          ⏳ הארך
                        </button>

                        <button
                          onClick={() => returnBorrow(borrow.id)}
                          style={{
                            margin: '0.25rem',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem',
                            cursor: 'pointer',
                          }}
                        >
                          🔄 החזר
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

// export default function AdminBorrows() {
//     const [borrows, setBorrows] = useState([]);
//     const userId = useSelector((state) => state.auth.userId);
//     const isAdmin = useSelector((state) => state.auth.isAdmin);

//     useEffect(() => {
//         if (!isAdmin) return;

//         const fetchBorrows = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3000/admin/borrows', {
//                     headers: { user: 'admin'}
//                 });
//                 setBorrows(response.data);
//             } catch (error) {
//                 console.error("Error fetching borrows:", error);
//             }
//         };
        
//         fetchBorrows();
//     }, [userId, isAdmin]);

//     const handleApproval = async (borrowId, status) => {
//         try {
//             await axios.put(`http://localhost:3000/admin/borrows/${borrowId}`, { status }, {
//                 headers: { Authorization: `Bearer ${userId}` }
//             });
//             setBorrows(borrows.map(borrow => 
//                 borrow.id === borrowId ? { ...borrow, status } : borrow
//             ));
//         } catch (error) {
//             console.error("Error updating borrow status:", error);
//         }
//     };

//     const handleExtendReturnDate = async (borrowId, newDate) => {
//         try {
//             await axios.put(`http://localhost:3000/admin/borrows/${borrowId}/extend`, { returnDate: newDate }, {
//                 headers: { Authorization: `Bearer ${userId}` }
//             });
//             setBorrows(borrows.map(borrow => 
//                 borrow.id === borrowId ? { ...borrow, endDate: newDate } : borrow
//             ));
//         } catch (error) {
//             console.error("Error extending return date:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>ניהול בקשות השאלה</h2>
//             {borrows.length === 0 ? (
//                 <p>אין בקשות השאלה להצגה</p>
//             ) : (
//                 <TableContainer component={Paper}>
//                     <Table>
//                         <TableHead>
//                             <TableRow>
//                                 <TableCell>שם משתמש</TableCell>
//                                 <TableCell>טלפון</TableCell>
//                                 <TableCell>אימייל</TableCell>
//                                 <TableCell>ציוד</TableCell>
//                                 <TableCell>תאריך התחלה</TableCell>
//                                 <TableCell>תאריך סיום</TableCell>
//                                 <TableCell>סטטוס</TableCell>
//                                 <TableCell>פעולות</TableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             {borrows.map((borrow) => (
//                                 <TableRow key={borrow.id}>
//                                     <TableCell>{borrow.user.username}</TableCell>
//                                     <TableCell>{borrow.user.phone}</TableCell>
//                                     <TableCell>{borrow.user.email}</TableCell>
//                                     <TableCell>{borrow.equipment.name}</TableCell>
//                                     <TableCell>{borrow.startDate}</TableCell>
//                                     <TableCell>{borrow.endDate}</TableCell>
//                                     <TableCell>{borrow.status}</TableCell>
//                                     <TableCell>
//                                         {borrow.status === 'pending' && (
//                                             <>
//                                                 <Button onClick={() => handleApproval(borrow.id, 'approved')} color="success">אשר</Button>
//                                                 <Button onClick={() => handleApproval(borrow.id, 'rejected')} color="error">דחה</Button>
//                                             </>
//                                         )}
//                                         {borrow.status === 'approved' && (
//                                             <Button onClick={() => handleExtendReturnDate(borrow.id, prompt("הכנס תאריך חדש (YYYY-MM-DD)"))}>
//                                                 הארך תאריך החזרה
//                                             </Button>
//                                         )}
//                                         {borrow.status === 'borrowed' && (
//                                             <Button onClick={() => handleApproval(borrow.id, 'returned')} color="primary">סמן כהוחזר</Button>
//                                         )}
//                                     </TableCell>
//                                 </TableRow>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//             )}
//         </div>
//     );
// }
