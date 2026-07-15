const jwt = require('jsonwebtoken');

// Simple authentication middleware (you can expand this)
const auth = (req, res, next) => {
  // For demo purposes, we'll skip auth
  // In production, implement JWT verification
  next();
};

module.exports = auth;
