const bcrypt = require('bcryptjs');
const { create, login } = require('../models/userModel');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    let hashed_key = bcrypt.hashSync(password, 8);
    try {
        const user = await create(name, email, hashed_key);
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    let hashed_key = bcrypt.hashSync(password, 8);
    try {
        const user = await login(email, hashed_key);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error logging in user:', error);
    }
}

module.exports = { createUser, loginUser };