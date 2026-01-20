const { addService, listServices, listByCode } = require('../controllers/servCont');
const express = require('express');
const router = express.Router();

router.post('/add', addService);
router.get('/list', listServices);
router.get('/list/:code', listByCode);

module.exports = router;