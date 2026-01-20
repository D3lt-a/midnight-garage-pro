const { 
    createRecord, 
    getAllRecords, 
    getRecordById, 
    updateRecord, 
    deleteRecord,
    getRecordsByDate,
    getRecordsByCarPlate
} = require('../models/recordModel');

async function addRecord(req, res) {
    const { servID, carID, recDate } = req.body;
    
    if (!servID || !carID) {
        return res.status(400).json({
            success: false,
            message: 'Service ID and Car ID are required'
        });
    }
    
    try {
        const record = await createRecord(servID, carID, recDate);
        res.status(201).json({
            success: true,
            message: 'Service record created successfully',
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create service record',
            error: error.message
        });
    }
}

async function listRecords(req, res) {
    try {
        const records = await getAllRecords();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved service records',
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve service records',
            error: error.message
        });
    }
}

async function getRecord(req, res) {
    const { id } = req.params;
    try {
        const record = await getRecordById(id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Service record not found'
            });
        }
        res.status(200).json({
            success: true,
            data: record
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve service record',
            error: error.message
        });
    }
}

async function editRecord(req, res) {
    const { id } = req.params;
    const { servID, carID, recDate } = req.body;
    
    if (!servID || !carID) {
        return res.status(400).json({
            success: false,
            message: 'Service ID and Car ID are required'
        });
    }
    
    try {
        const updated = await updateRecord(id, servID, carID, recDate);
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Service record not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Service record updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update service record',
            error: error.message
        });
    }
}

async function removeRecord(req, res) {
    const { id } = req.params;
    try {
        const deleted = await deleteRecord(id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Service record not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Service record deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete service record',
            error: error.message
        });
    }
}

async function dailyReport(req, res) {
    const { date } = req.query;
    
    if (!date) {
        return res.status(400).json({
            success: false,
            message: 'Date parameter is required'
        });
    }
    
    try {
        const records = await getRecordsByDate(date);
        res.status(200).json({
            success: true,
            message: 'Daily report retrieved successfully',
            data: records
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve daily report',
            error: error.message
        });
    }
}

async function carBill(req, res) {
    const { plate } = req.params;
    
    try {
        const records = await getRecordsByCarPlate(plate);
        if (records.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No records found for this car'
            });
        }
        
        const totalAmount = records.reduce((sum, r) => sum + r.servPrice, 0);
        const totalPaid = records.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
        
        res.status(200).json({
            success: true,
            message: 'Bill retrieved successfully',
            data: {
                carPlate: records[0].carPlate,
                carType: records[0].carType,
                carModel: records[0].carModel,
                driverPhone: records[0].driverNum,
                mechanic: records[0].mechName,
                services: records.map(r => ({
                    date: r.recDate,
                    service: r.servName,
                    price: r.servPrice,
                    paid: r.paidAmount || 0
                })),
                totalAmount,
                totalPaid,
                balance: totalAmount - totalPaid
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve bill',
            error: error.message
        });
    }
}

module.exports = { 
    addRecord, 
    listRecords, 
    getRecord, 
    editRecord, 
    removeRecord,
    dailyReport,
    carBill
};
