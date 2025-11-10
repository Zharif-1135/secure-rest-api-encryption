const express = require('express');
const router = express.Router();
const { registerUser, loginUser, encryptData, decryptData } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/encrypt', encryptData);
router.post('/decrypt', decryptData);

module.exports = router;
