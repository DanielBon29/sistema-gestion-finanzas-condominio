const express = require('express');
const route = express.Router();

const servicesComprobante = require('../services/8_render_comprobante');

/**
 * @description Comprobante Route
 * @method GET/
*/
route.get('/comprobante-ingreso-creado', servicesComprobante.generateIngresoPdf);

route.get('/comprobante-egreso-creado', servicesComprobante.generateEgresoPdf);

route.get('/comprobante-ingreso-modificado', servicesComprobante.modifyIngresoPdf);

route.get('/comprobante-egreso-modificado', servicesComprobante.modifyEgresoPdf);


module.exports = route;