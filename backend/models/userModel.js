const db = require('../configs/db');

async function create(name, email, hashed_key) {
    const query = `
        INSERT INTO users(userName, userEmail, userKey)
        VALUES (?, ?, ?)
    `
    try {
        const values = [name, email, hashed_key]
        const result = await db.execute(query, values)
        console.log(result) 
        return {
            userID: result.insertId,
            name,
            email
        }
    } catch (error) {
        console.error('Failure to create the user', error)
    }
}

async function login(email, hashed_key) { 
    const query = `
        SELECT * FROM users 
        WHERE userEmail = ? AND userKey = ?
    `
    const values = [email, hashed_key]

    try {
        const result = await db.execute(query, values)
        return result[0]
    } catch (error) {
        console.error('Failure to login user', error)
    }
}

module.exports = { create, login }