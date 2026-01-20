const db = require('../configs/db');

async function createPayment(recID, amount, payDate) {
    const query = `
        INSERT INTO payments(recID, amount, payDate)
        VALUES (?, ?, ?)
    `;
    try {
        const values = [recID, amount, payDate || new Date()];
        const [result] = await db.execute(query, values);
        return { payID: result.insertId, recID, amount, payDate };
    } catch (error) {
        console.error('Failure to create payment', error);
        throw error;
    }
}

async function getAllPayments() {
    const query = `
        SELECT 
            p.payID,
            p.recID,
            p.amount,
            p.payDate,
            p.created_at,
            sr.recDate,
            c.carPlate,
            c.driverNum,
            s.servName,
            s.servPrice
        FROM payments p
        JOIN serv_records sr ON p.recID = sr.recID
        JOIN cars c ON sr.carID = c.carID
        JOIN services s ON sr.servID = s.servID
        ORDER BY p.created_at DESC
    `;
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        console.error('Failure to get payments', error);
        throw error;
    }
}

async function getPaymentById(payID) {
    const query = `
        SELECT 
            p.payID,
            p.recID,
            p.amount,
            p.payDate,
            p.created_at,
            sr.recDate,
            c.carPlate,
            c.driverNum,
            s.servName,
            s.servPrice
        FROM payments p
        JOIN serv_records sr ON p.recID = sr.recID
        JOIN cars c ON sr.carID = c.carID
        JOIN services s ON sr.servID = s.servID
        WHERE p.payID = ?
    `;
    try {
        const [rows] = await db.execute(query, [payID]);
        return rows[0] || null;
    } catch (error) {
        console.error('Failure to get payment', error);
        throw error;
    }
}

async function getPaymentsByRecordId(recID) {
    const query = `
        SELECT * FROM payments WHERE recID = ?
    `;
    try {
        const [rows] = await db.execute(query, [recID]);
        return rows;
    } catch (error) {
        console.error('Failure to get payments by record', error);
        throw error;
    }
}

module.exports = { 
    createPayment, 
    getAllPayments, 
    getPaymentById,
    getPaymentsByRecordId
};
