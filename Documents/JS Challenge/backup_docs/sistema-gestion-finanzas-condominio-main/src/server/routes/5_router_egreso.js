const express = require('express');
const route = express.Router();

const servicesEgreso = require('../services/5_render_egreso');
const controllerEgreso = require('../controller/5_controller_egreso');

// Egreso Routes //
/**
 * @description datos de egresos
 * @method GET/registro-egresos
*/
route.get('/registro-egresos', servicesEgreso.dataEgresos);

/**
 * @description crear nuevo egreso
 * @method GET/registro-egresos-crear
*/
route.get('/registro-egresos-crear', servicesEgreso.crearEgreso);

/**
 * @description modificar estado de egreso
 * @method GET/registro-egresos-modificar
*/
route.get('/registro-egresos-modificar', servicesEgreso.modificarEgreso);

//API
route.post('/api/egreso',controllerEgreso.create);
route.get('/api/egreso',controllerEgreso.find);
route.put('/api/egreso/:id',controllerEgreso.update);
route.delete('/api/egreso/:id',controllerEgreso.delete);


module.exports = route;