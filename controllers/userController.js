const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Ambil key dari .env
const KEY = process.env.ENCRYPTION_KEY;
const IV = process.env.ENCRYPTION_IV;

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login success', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.encryptData = (req, res) => {
  try {
    const { text } = req.body;
    const key = Buffer.from(process.env.ENCRYPTION_KEY);
    const iv = Buffer.from(process.env.ENCRYPTION_IV);

    if (!text) throw new Error("Missing 'text' in request body");
    if (!key || !iv) throw new Error("Missing ENCRYPTION_KEY or ENCRYPTION_IV");

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    res.json({ encrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.decryptData = (req, res) => {
  try {
    const { encrypted } = req.body;
    const key = Buffer.from(process.env.ENCRYPTION_KEY);
    const iv = Buffer.from(process.env.ENCRYPTION_IV);

    if (!encrypted) throw new Error("Missing 'encrypted' in request body");
    if (!key || !iv) throw new Error("Missing ENCRYPTION_KEY or ENCRYPTION_IV");

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    res.json({ decrypted });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
