const {DataTypes} = require('sequelize');
const {db} = require('./../database/config');
const bcrypt = require('bcrypt');
module.exports = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('available', 'unavailable'),
    allowNull: false,
    defaultValue: 'available',
  },
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
      console.log("Aca ", user.password);
    },
  }
});