const express = require('express');
const router = express.Router();
const { 
    addPayment, 
    listPayments, 
    getPayment,
    getPaymentsByRecord
} = require('../controllers/paymentCont');

router.post('/add', addPayment);
router.get('/list', listPayments);
router.get('/get/:id', getPayment);
router.get('/record/:recID', getPaymentsByRecord);

module.exports = router;
