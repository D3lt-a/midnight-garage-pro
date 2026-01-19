const { createUser, loginUser } = require('../controllers/userCont');
const express = require('express');
const router = express.Router();

router.post('/create', createUser);
router.post('/login', loginUser);

module.exports = router;