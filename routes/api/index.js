const route = require('express').Router();

route.use('/users', require('./users'));
route.use('/listings', require('./listings'));
route.use('/wishlist', require('./wishlist'));
route.use('/messages', require('./messages'));

exports = module.exports = {
    route
};
