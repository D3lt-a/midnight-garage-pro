const { createServices, retrieveServices, getSercviceByCode } = require('../models/servModel');

async function addService(req, res) {
    const { code, name, price } = req.body;
    try {
        await createServices(code, name, price);
        res.status(201).json({
            success: true,
            message: 'Service added successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to Add a Service",
            error: error.message
        })
    }
}

async function listServices(req, res) {
    try {
        const services = await retrieveServices();
        res.status(200).json({
            success: true,
            message: 'Successfully retrieved services',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve services",
            error: error.message
        })
    }
}

async function listByCode(req, res) {
    const code = req.params.code;
    try {
        const row = await getSercviceByCode(code);
        res.status(200).json({
            success: true,
            message: 'Service retrieved successfully',
            data: row
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve service by code",
            error: error.message
        })
    }
}

module.exports = { addService, listServices, listByCode }