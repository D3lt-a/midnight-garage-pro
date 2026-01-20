const { 
    createPayment, 
    getAllPayments, 
    getPaymentById,
    getPaymentsByRecordId
} = require('../models/paymentModel');

async function addPayment(req, res) {
    const { recID, amount, payDate } = req.body;
    
    if (!recID || !amount) {
        return res.status(400).json({
            success: false,
            message: 'Record ID and amount are required'
        });
    }
    
    try {
        const payment = await createPayment(recID, amount, payDate);
        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to record payment',
            error: error.message
        });
    }
}

async function listPayments(req, res) {
    try {
        const payments = await getAllPayments();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved payments',
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payments',
            error: error.message
        });
    }
}

async function getPayment(req, res) {
    const { id } = req.params;
    try {
        const payment = await getPaymentById(id);
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }
        res.status(200).json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payment',
            error: error.message
        });
    }
}

async function getPaymentsByRecord(req, res) {
    const { recID } = req.params;
    try {
        const payments = await getPaymentsByRecordId(recID);
        res.status(200).json({
            success: true,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve payments',
            error: error.message
        });
    }
}

module.exports = { 
    addPayment, 
    listPayments, 
    getPayment,
    getPaymentsByRecord
};
