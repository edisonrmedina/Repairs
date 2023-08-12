const express = require('express');
const routes = express.Router();
const userMiddleware = require('../middlewares/user.middleware');
const repairController = require('../controllers/repair.controller');

routes.get('/',
  userMiddleware.validateUserExist,
  repairController.findAllRepairByUser
);

module.exports = routes;
