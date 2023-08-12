const { validationResult , body} = require('express-validator');

const validadFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: 'error',errors: errors.mapped(), });
    }
    next();
}

exports.validCreateUser = [
  body('fullName').not().isEmpty().withMessage('El nombre es requerido'),
  body('email').not().isEmpty().withMessage('El email es requerido'),
  body('email').isEmail().withMessage('El email debe ser válido'),
  body('password').not().isEmpty().withMessage('La contraseña es requerida'),
  body('password')
    .custom(
      //podriamos hacer validaciones en lado del servidor y ver si en la bd existe por ejemplo ya el email
      (value) => {
        return /[A-Z]/.test(value);
      }
    )
    .withMessage(
      'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un caracter especial'
    ),
  body('role').not().isEmpty().withMessage('El rol es requerido'),
  body('role')
    .isIn(['employee', 'client'])
    .withMessage('El rol debe ser empleado o cliente'),
  validadFields,
];

exports.validUpdateUser = [
  body('name')
    .optional()
    .isString()
    .withMessage('El nombre debe ser una cadena de caracteres'),
  body('email').optional().isEmail().withMessage('El email debe ser válido'),
];

exports.validCreateRepair = [
    body('date').not().isEmpty().withMessage('La fecha es requerida'),
    body('motorsNumber').not().isEmpty().withMessage('El numero de motores es requerido'),
    body('motorsNumber').isNumeric().withMessage('El numero de motores debe ser un número'),
    validadFields
];

