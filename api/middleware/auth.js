const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { userId };
    next();
  } catch (err) {
    res.status(401).json({ message: "Not authenticated" });
  }

}