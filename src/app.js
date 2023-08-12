const express = require('express');
const morgan = require('morgan');

const userRoutes = require('./routes/user.route'); 
const repairRoutes = require('./routes/repair.route');
const mixedRoutes = require('./routes/mixed.routes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/error.controller');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// rutas
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/repairs', repairRoutes);
app.use('/api/v1/mineRepairs', mixedRoutes);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler)

module.exports = app;