const setRateLimit = require("express-rate-limit");

// Rate limit middleware
const rateLimitMiddleware = setRateLimit({
  windowMs: 5 * 60 * 1000,
  max: 2,
  message: "You have exceeded your 5 requests per minute limit.",
  headers: true,
});

module.exports = rateLimitMiddleware;
