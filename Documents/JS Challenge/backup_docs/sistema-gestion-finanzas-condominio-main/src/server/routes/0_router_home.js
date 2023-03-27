const express = require('express');
const route = express.Router();

const servicesHome = require('../services/0_render_home');

/**
 * @description Root Route
 * @method GET/
*/
route.get('/home', servicesHome.homeRoutes);

module.exports = route;