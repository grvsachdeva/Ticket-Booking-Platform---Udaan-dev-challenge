const route = require('express').Router();
//
route.use('/screens', require('./screens'));
// route.use('/listings', require('./listings'));
// route.use('/wishlist', require('./wishlist'));
// route.use('/messages', require('./messages'));
//
exports = module.exports = {
    route
};
