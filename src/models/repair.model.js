const { DataTypes } = require('sequelize');
const {db } = require('./../database/config');

module.exports = db.define('Repair', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  motorsNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed','cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id', // alias para la base de datos
  },
});