const User = require('../models/user.model');
const generateJWT = require('../utils/jwt');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.findAllUser = catchAsync(async(req, res, next) => {
  try {
    const users = await User.findAll({
      where: {
        status: 'available',
      },
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json({
      status: 'success',
      users,
    });
  } catch (error) {
    
    return next(new AppError(error, 500));
  }
});

exports.findOne = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(400).json({
        error: 'not exist.',
      });
      return next(new AppError(' User not exist.', 500));
    } else {
      return res.status(200).json({
        status: 'success',
        user,
      });
    }
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.createUser = catchAsync(async (req, res, next) => {
  try {
    const { fullName, email, password, role, status } = req.body;

    const user = await User.create({
      fullName,
      email,
      password,
      role,
      status,
    });

    const token = await generateJWT(user.id);

    return res.status(200).json({
      status: 'success',
      token,
      user,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
});


exports.updateUser = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;
    const user = await User.findOne({
      where: {
        id,
        status: 'available',
      },
    });

    if (!user) {
      return next(new AppError('User not exist', 401));
    }

    await user.update({
      fullName,
      email,
    });

    return res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    return next(new AppError('error', 500));
  }
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        status: 'available',
      },
    });
    if (!user) {
      return next(new AppError('User not exist', 401));
    }
    await user.update({
      status: 'unavailable',
    });

    return res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;
  if (!user) {
    return next(new AppError('User not found', 401));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Invalid account number or password', 401));
  }

  const token = await generateJWT(user.id);

  return res.status(200).json({
    status: 'success',
    token,
    user,
  });
});
