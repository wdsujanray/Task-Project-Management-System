const crypto = require('crypto');

const tokenSecret = process.env.AUTH_SECRET || 'development-only-change-this-secret';

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedPassword) {
  const [salt, storedHash] = storedPassword.split(':');
  if (!salt || !storedHash) return false;

  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

function createToken(userId) {
  const payload = Buffer.from(JSON.stringify({ userId, expiresAt: Date.now() + 86400000 })).toString('base64url');
  const signature = crypto.createHmac('sha256', tokenSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function getUserIdFromToken(token) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;

  const expectedSignature = crypto.createHmac('sha256', tokenSecret).update(payload).digest('base64url');
  if (signature.length !== expectedSignature.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  return data.expiresAt > Date.now() ? data.userId : null;
}

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email, role: user.role || 'Project Manager', profileImage: user.profileImage || '' };
}

module.exports = { createToken, getUserIdFromToken, hashPassword, publicUser, verifyPassword };