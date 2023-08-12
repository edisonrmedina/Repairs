const express = require('express');
const userController = require('../controllers/user.controller');
const routes = express.Router();
const validationMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const userMiddleware = require('../middlewares/user.middleware');

// Las rutas públicas no requieren autenticación
routes.route('/login').post(userMiddleware.validUser, userController.login);

// Rutas protegidas por autenticación
routes.use(authMiddleware.protect);

// Rutas protegidas con autorización basada en roles
routes
  .route('/')
  .get(userController.findAllUser)
  .post(validationMiddleware.validCreateUser, userController.createUser);

routes
  .route('/:id')
  .get(userController.findOne)
  .patch(
    validationMiddleware.validUpdateUser,
    userMiddleware.validateUserExist,
    authMiddleware.restrictTo('admin'),
    userController.updateUser
  )
  .delete(
    userMiddleware.validateUserExist,
    authMiddleware.restrictTo('admin'),
    userController.deleteUser
  );

module.exports = routes;
