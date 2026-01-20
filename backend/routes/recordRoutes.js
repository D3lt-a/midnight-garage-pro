const express = require('express');
const router = express.Router();
const { 
    addRecord, 
    listRecords, 
    getRecord, 
    editRecord, 
    removeRecord,
    dailyReport,
    carBill
} = require('../controllers/recordCont');

// CRUD Routes
router.post('/add', addRecord);
router.get('/list', listRecords);
router.get('/get/:id', getRecord);
router.put('/update/:id', editRecord);
router.delete('/delete/:id', removeRecord);

// Report Routes
router.get('/report/daily', dailyReport);
router.get('/report/bill/:plate', carBill);

module.exports = router;
