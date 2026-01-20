const bcrypt = require('bcryptjs');
const { create, login } = require('../models/userModel');

const createUser = async (req, res) => {
    console.log('Request Body:', req.body);
    const { name, email, password } = req.body;
    let hashed_key = bcrypt.hashSync(password, 8);
    try {
        await create(name, email, hashed_key);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
        });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const { findByEmail } = require('../models/userModel');
        const user = await findByEmail(email);
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        
        const isMatch = await bcrypt.compare(password, user.userKey);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                userID: user.userID,
                userName: user.userName,
                userEmail: user.userEmail
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login user',
            error: error.message
        });
    }
}

module.exports = { createUser, loginUser };