const jwt = require('jsonwebtoken');

const JWT_SECRET = 'secretkey';

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) res.status(401).send({ message: 'Необходима авторизация' });

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};

module.exports = {
  auth,
  JWT_SECRET,
};
