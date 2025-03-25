import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function BorrowedEquipment() {
    const [borrows, setBorrows] = useState([]);
    const [equipments, setEquipments] = useState([]);
    const userId = useSelector((state) => state.auth.userId);

    useEffect(() => {
        const fetchBorrows = async () => {
            try {
                const response = await axios.get('http://localhost:3000/borrows/me', {
                    headers: { 'user': userId }
                });
                setBorrows(response.data);
            } catch (error) {
                console.error("Error fetching borrows:", error);
            }
        };

        const fetchEquipments = async () => {
            try {
                const response = await axios.get("http://localhost:3000/equipments");
                setEquipments(response.data);
            } catch (error) {
                console.error("Error fetching equipment:", error);
            }
        };

        fetchEquipments();
        fetchBorrows();
    }, [userId]);

    const handleReturn = async (borrowId, equipmentId) => {
        try {
            await axios.put(`http://localhost:3000/borrow/${borrowId}/return`, {}, {
                headers: { 'user': userId }
            });

            const updatedBorrows = borrows.map(borrow =>
                borrow.id === borrowId ? { ...borrow, status: 'completed' } : borrow
            );
            setBorrows(updatedBorrows);

            const isStillBorrowed = updatedBorrows.some(borrow =>
                borrow.equipmentId === equipmentId && borrow.status === 'borrowed'
            );

            setEquipments(equipments.map(equip =>
                equip.id === equipmentId
                    ? { ...equip, status: isStillBorrowed ? 'נשאל' : 'זמין' }
                    : equip
            ));

            alert("הציוד הוחזר בהצלחה!");
        } catch (error) {
            console.error("Error returning equipment:", error);
            alert("הייתה בעיה בהחזרת הציוד.");
        }
    };

    return (
        <div>
            <h2>ציוד שהושאל</h2>
            {borrows.length === 0 ? (
                <p>אין ציוד שהושאל עדיין</p>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>תאריך סיום</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>תאריך התחלה</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>סטטוס השאלה</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>ציוד</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>החזר</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {borrows.map((borrow) => {
                                const equipment = equipments.find(equip => equip.id === borrow.equipmentId);
                                const formattedReturnDate = borrow.endDate ? new Date(borrow.endDate).toLocaleDateString() : 'לא זמין';
                                const formattedBorrowDate = borrow.startDate ? new Date(borrow.startDate).toLocaleDateString() : 'לא זמין';

                                return (
                                    <TableRow key={borrow.id}>
                                        <TableCell>{formattedReturnDate}</TableCell>
                                        <TableCell>{formattedBorrowDate}</TableCell>
                                        <TableCell>{borrow.status === 'borrowed' ? 'נשאל' : borrow.status}</TableCell>
                                        <TableCell>{equipment ? equipment.name : <span style={{ color: 'red' }}>ציוד לא זמין</span>}</TableCell>
                                        <TableCell>
                                            {borrow.status !== 'completed' && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleReturn(borrow.id, borrow.equipmentId)}
                                                >
                                                    החזר ציוד
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
