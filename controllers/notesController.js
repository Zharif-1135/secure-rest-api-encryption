const Note = require('../models/Note');
const { encrypt, decrypt } = require('../utils/encrypt');

exports.createNote = async (req, res) => {
  try {
    const { text } = req.body;
    const encrypted = encrypt(text);
    const note = await Note.create({ userId: req.user.userId, encryptedText: encrypted });
    res.status(201).json({ id: note._id, encryptedText: note.encryptedText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.userId }).lean();
    // Optional: return decrypted version for demo (but in production, prefer decrypted on client after secure channel)
    const withPlain = notes.map(n => ({ id: n._id, encrypted: n.encryptedText, decrypted: decrypt(n.encryptedText) }));
    res.json(withPlain);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
