const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateJWT = (id) => {
  return new Promise((resolve, reject) => {
    const payload = { id };
    console.log(process.env.JWT_SECRET, process.env.JWT_LIFETIME);
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFETIME,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = generateJWT;
