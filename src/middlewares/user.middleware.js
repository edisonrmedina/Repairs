const express = require('express');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

exports.validUser = catchAsync(async (req, res, next) => {
   
  const { email } = req.body;
  
  const user = await User.findOne({
    where: {
      email,
    },
  });
  
  if (!user) {
    return next(new AppError('User not found', 401));
  }

  req.user = user;
  next();
});


exports.verifyRole = catchAsync(async(req, res, next) => {

  if (!req.user) {
    return next(new AppError('Usuario no autenticado', 401));
  }

  const userRole = req.user.role;

  if (userRole !== 'employee' && userRole !== 'client') {
    return next(
      new AppError(
        'Acceso denegado. No tienes permisos para realizar esta acción.',
        403
      )
    );
  }

  next();
});

exports.validateUserExist = catchAsync(async (req, res, next) => {
  
  try {
    const token = req.headers.authorization ;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET); // Reemplaza 'secreto_del_jwt' con tu secreto de JWT
    
    const userId = decoded.id;
    
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    
    
    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError(err, 500));
  }
});

exports.validatePendingServiceExist = catchAsync(async (req, res, next) => {
  const { serviceId } = req.params;
  
  try {
    const service = await Service.findOne({
      where: {
        id: serviceId,
        status: 'pending',
      },
    });

    if (!service) {
      return next(new AppError('Servicio pendiente no encontrado', 404));
    }

    req.service = service;
    next();
  } catch (err) {
    return next(
      new AppError('Hubo un error al buscar el servicio pendiente', 500)
    );
  }
});