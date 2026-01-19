const { addCar, getCars, getCarByPlate } = require('../models/carModels');

async function createCar(req, res){
    console.log('Request Body: ', req.body)
    const {num, type, model, year, phone, name} = req.body;
    try {
        await addCar(num, type, model, year, phone, name);
        res.status(201).json({
            success: true,
            message: 'Car added successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add car',
        });
    }
}

async function listCars(req, res){
    try {
        const [cars] = await getCars();
        res.status(200).json({
            success: true,
            data: cars,
        });
        return rows
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve cars',
        });
    }
}

async function listCarbyPlate(req, res){
    const { plate } = req.params;
    try {
        const car = await getCarByPlate(plate);
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found',
            });
        }
        res.status(200).json({
            success: true,
            data: car,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve car',
        });
    }
}

module.exports = { createCar, listCars, listCarbyPlate };