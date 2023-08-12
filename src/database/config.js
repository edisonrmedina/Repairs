const { Sequelize } = require('sequelize');
require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env

const db = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
});

module.exports = {
  db,
};
