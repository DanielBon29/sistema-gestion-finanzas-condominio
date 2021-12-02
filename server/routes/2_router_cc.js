const express = require('express');
const route = express.Router();

const servicesCC = require('../services/2_render_cc');
const controllerCC = require('../controller/2_controller_cc');

// CC Routes //
/**
 * @description datos de centros de costo
 * @method GET/nuestros-proveedores
*/
route.get('/nuestros-proveedores', servicesCC.dataCC);

//API CC
route.post('/api/cc',controllerCC.create);
route.get('/api/cc',controllerCC.find);

module.exports = route;