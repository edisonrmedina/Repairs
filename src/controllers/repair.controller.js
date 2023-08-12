const { Op } = require('sequelize');
const Repair = require('../models/repair.model');
const userModel = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.findAllRepair = catchAsync(async (req, res,next) => {
  try {
    const repairs = await Repair.findAll({
      where: {
        [Op.or]: [{ status: 'pending' }, { status: 'completed' }],
      },
      include: [
        {
          model: userModel,
          attributes: ['fullName', 'email', 'password', 'role', 'status'],
        },
      ],
    });
    res.status(200).json(repairs);
  } catch (error) {
    return next(new AppError(error, 500)); 
  }
});

exports.findAllRepairByUser = catchAsync(async (req, res, next) => {
  const user = req.user;
  try {
    const repairs = await Repair.findAll({
      where: {
        user_id: user.id,
        [Op.or]: [{ status: 'pending' }, { status: 'completed' }],
      },
      include: [
        {
          model: userModel,
          attributes: ['fullName', 'email', 'password', 'role', 'status'],
        },
      ],
    });
    res.status(200).json(repairs);
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.findOneRepair = catchAsync(async (req, res, next) => {
  try {
    const repair = await Repair.findOne({
      where: {
        id: req.params.id,
      },
      include: [userModel],
    });
    if (!repair) {
      return res.status(400).json({
        error: 'Repair not exist.',
      });
    }
    res.status(200).json(repair);
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.createRepair = catchAsync(async (req, res, next) => {
  try {
    const { date, userId,motorsNumber} = req.body
    if (!date || !userId) {
      return next(new AppError('date and userId are required fields.', 400));
    }

    const user = await userModel.findByPk(userId);
    if (!user) {
      return next(
        new AppError('Repair not found with the provided userId.', 404)
      );
    }

    const repair = await Repair.create({
      date,
      userId: userId,
      motorsNumber,
      status: 'pending',
    });
    console.log(user);
    res.status(200).json(repair);
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.updateRepair = catchAsync(async (req, res, next) => {
  try {
    const repair = await Repair.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!repair) {
      return res.status(400).json({
        error: 'Repair not exist.',
      });
    }
    const { status }  = req.body;
    await repair.update({
      status,
    });
    res.status(200).json(repair);
  } catch (error) {
    return next(new AppError(error, 500));
  }
});

exports.deleteRepair = async (req, res, next) => {
  try {
    const repair = await Repair.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!repair) {
      return res.status(400).json({
        error: 'Repair not exist.',
      });
    }
    await repair.update({
      status: 'cancelled',
    });
    res.status(200).json({
      status: 'success',
      repair,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};