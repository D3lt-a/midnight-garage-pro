const { createCar, listCars, listCarbyPlate } = require('../controllers/carCont');

const express = require('express');
const router = express.Router();

router.post('/create', createCar);
router.get('/list', listCars);
router.get('/get/:plate', listCarbyPlate);

module.exports = router;