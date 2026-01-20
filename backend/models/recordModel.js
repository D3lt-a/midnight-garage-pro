const db = require('../configs/db');

async function createRecord(servID, carID, recDate) {
    const query = `
        INSERT INTO serv_records(servID, carID, recDate)
        VALUES (?, ?, ?)
    `;
    try {
        const values = [servID, carID, recDate || new Date()];
        const [result] = await db.execute(query, values);
        return { recID: result.insertId, servID, carID, recDate };
    } catch (error) {
        console.error('Failure to create service record', error);
        throw error;
    }
}

async function getAllRecords() {
    const query = `
        SELECT 
            sr.recID,
            sr.servID,
            sr.carID,
            sr.recDate,
            sr.created_at,
            c.carPlate,
            c.carType,
            c.carModel,
            c.driverNum,
            c.mechName,
            s.servCode,
            s.servName,
            s.servPrice
        FROM serv_records sr
        JOIN cars c ON sr.carID = c.carID
        JOIN services s ON sr.servID = s.servID
        ORDER BY sr.created_at DESC
    `;
    try {
        const [rows] = await db.execute(query);
        return rows;
    } catch (error) {
        console.error('Failure to get records', error);
        throw error;
    }
}

async function getRecordById(recID) {
    const query = `
        SELECT 
            sr.recID,
            sr.servID,
            sr.carID,
            sr.recDate,
            sr.created_at,
            c.carPlate,
            c.carType,
            c.carModel,
            c.driverNum,
            c.mechName,
            s.servCode,
            s.servName,
            s.servPrice
        FROM serv_records sr
        JOIN cars c ON sr.carID = c.carID
        JOIN services s ON sr.servID = s.servID
        WHERE sr.recID = ?
    `;
    try {
        const [rows] = await db.execute(query, [recID]);
        return rows[0] || null;
    } catch (error) {
        console.error('Failure to get record', error);
        throw error;
    }
}

async function updateRecord(recID, servID, carID, recDate) {
    const query = `
        UPDATE serv_records 
        SET servID = ?, carID = ?, recDate = ?
        WHERE recID = ?
    `;
    try {
        const [result] = await db.execute(query, [servID, carID, recDate, recID]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Failure to update record', error);
        throw error;
    }
}

async function deleteRecord(recID) {
    const query = `DELETE FROM serv_records WHERE recID = ?`;
    try {
        const [result] = await db.execute(query, [recID]);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('Failure to delete record', error);
        throw error;
    }
}

async function getRecordsByDate(date) {
    const query = `
        SELECT 
            sr.recID,
            sr.recDate,
            c.carPlate,
            c.driverNum,
            s.servName,
            s.servPrice,
            p.amount as paidAmount,
            p.payDate
        FROM serv_records sr
        JOIN cars c ON sr.carID = c.carID
        JOIN services s ON sr.servID = s.servID
        LEFT JOIN payments p ON sr.recID = p.recID
        WHERE DATE(sr.recDate) = DATE(?)
        ORDER BY sr.created_at DESC
    `;
    try {
        const [rows] = await db.execute(query, [date]);
        return rows;
    } catch (error) {
        console.error('Failure to get records by date', error);
        throw error;
    }
}

async function getRecordsByCarPlate(carPlate) {
    const query = `
        SELECT 
            sr.recID,
            sr.recDate,
            c.carPlate,
            c.carType,
            c.carModel,
            c.driverNum,
            c.mechName,
            s.servCode,
            s.servName,
            s.servPrice,
            p.amount as paidAmount,
            p.payDate
        FROM serv_records sr
        JOIN cars c ON sr.carID = c.carID
        JOIN services s ON sr.servID = s.servID
        LEFT JOIN payments p ON sr.recID = p.recID
        WHERE c.carPlate = ?
        ORDER BY sr.recDate DESC
    `;
    try {
        const [rows] = await db.execute(query, [carPlate]);
        return rows;
    } catch (error) {
        console.error('Failure to get records by car plate', error);
        throw error;
    }
}

module.exports = { 
    createRecord, 
    getAllRecords, 
    getRecordById, 
    updateRecord, 
    deleteRecord,
    getRecordsByDate,
    getRecordsByCarPlate
};
