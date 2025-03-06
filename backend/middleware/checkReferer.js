require('dotenv').config(); // 读取 .env 配置

module.exports = (req, res, next) => {
    const allowedOrigin = process.env.FRONT_DOMAIN;
    const referer = req.get('Referer');
  
    if (!referer || !referer.startsWith(allowedOrigin)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
  