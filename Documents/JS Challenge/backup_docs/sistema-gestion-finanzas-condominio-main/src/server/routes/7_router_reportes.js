const express = require('express');
const route = express.Router();

const servicesReportes = require('../services/7_render_reportes');

/**
 * @description Reportes Route
 * @method GET/
*/
route.get('/reportes', servicesReportes.reporteRoutes);

route.get('/reporte-morosidad', servicesReportes.reporteMorosidad);

route.get('/reporte-deudas', servicesReportes.reporteDeudas);

route.get('/reporte-flujo', servicesReportes.reporteFlujo);

module.exports = route;