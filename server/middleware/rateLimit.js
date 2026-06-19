const ipRequestStore = new Map();

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 120 } = {}) => (req, res, next) => {
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();

  const ipData = ipRequestStore.get(ipAddress) || { count: 0, windowStart: now };

  if (now - ipData.windowStart > windowMs) {
    ipData.count = 0;
    ipData.windowStart = now;
  }

  ipData.count += 1;
  ipRequestStore.set(ipAddress, ipData);

  if (ipData.count > max) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again shortly.'
    });
  }

  return next();
};

module.exports = createRateLimiter;
