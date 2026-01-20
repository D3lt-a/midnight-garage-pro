const db = require('../configs/db');

async function addCar(num, type, model, year, phone, name) {
    const query = `
        INSERT INTO cars(carPlate, cartype, carModel, carYear, driverNum, mechName)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
        const values = [num, type, model, year, phone, name];
        const result = await db.execute(query, values);
        console.log('Car added: ', result);
    } catch (error) {
        console.error('Failure to add the car', error);
    }
}

async function getCars() {
    const query = `
        SELECT * FROM cars
    `;
    try {
        const results = await db.execute(query);
        return results;
    } catch (error) {
        console.log('Failure to get cars', error);
    }
}

async function getCarByPlate(plateNumber) {
    const query = `
        SELECT * FROM cars WHERE carPlate = ?
    `;
    try {
        const result = await db.execute(query, [plateNumber]);
        return result;
    } catch (error) {
        console.error('Failure to get the car', error);
    }
}

module.exports = { addCar, getCars, getCarByPlate };