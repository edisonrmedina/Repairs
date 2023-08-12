const express = require('express');
const repairController = require('../controllers/repair.controller');
const routes = express.Router();
const validationMiddleware = require('../middlewares/validation.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Las rutas están protegidas por autenticación
routes.use(authMiddleware.protect);

routes
  .route('/')
  .get(repairController.findAllRepair)
  .post(validationMiddleware.validCreateRepair, repairController.createRepair);

routes
  .route('/:id')
  .get(repairController.findOneRepair)
  .patch(repairController.updateRepair)
  .delete(repairController.deleteRepair);


module.exports = routes;
