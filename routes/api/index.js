const route = require('express').Router();

route.use('/screens', require('./screens'));

exports = module.exports = {
    route
};
