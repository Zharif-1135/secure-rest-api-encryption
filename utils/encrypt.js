const crypto = require('crypto');

const ALGO = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); // 32 bytes
const IV = Buffer.from(process.env.ENCRYPTION_IV, 'utf8'); // 16 bytes

function encrypt(text) {
  const cipher = crypto.createCipheriv(ALGO, KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decrypt(enc) {
  const decipher = crypto.createDecipheriv(ALGO, KEY, IV);
  let decrypted = decipher.update(enc, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

module.exports = { encrypt, decrypt };
