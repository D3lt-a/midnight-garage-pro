const db = require('../configs/db');

async function createServices(code, name, price) {
    const query = `
        INSERT INTO services(servCode, servName, servPrice)
        VALUES (?, ?, ?)
    `;
    try {
        const values = [code, name, price];
        const result = await db.execute(query, values);
        console.log('Service added: ', result);
    } catch (error) {
        console.error('Failure to add the service', error);
    }
}

async function retrieveServices(){
    const query = `
        SELECT * FROM services
    `;
    try {
        const result = await db.execute(query);
        return result;
    } catch (error) {
        console.error('Failure to retrieve services', error);
    }
}

async function getSercviceByCode(code) {
    const query = `
        SELECT * FROM services WHERE servCode = ?
    `;
    try {
        const result = await db.execute(query, [code]);
        return result;
    } catch (error) {
        console.error('Failure to retrieve service by code', error);
    }
}

module.exports = { createServices, retrieveServices, getSercviceByCode }