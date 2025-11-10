const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createNote, getNotes } = require('../controllers/notesController');

router.post('/', auth, createNote);
router.get('/', auth, getNotes);

module.exports = router;
