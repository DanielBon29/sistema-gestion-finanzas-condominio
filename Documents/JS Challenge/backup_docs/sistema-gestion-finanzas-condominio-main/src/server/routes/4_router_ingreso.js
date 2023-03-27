const express = require('express');
const route = express.Router();

const servicesIngreso = require('../services/4_render_ingreso');
const controllerIngreso = require('../controller/4_controller_ingreso');

// Ingreso Routes //
/**
 * @description datos de ingresos
 * @method GET/registro-ingresos
*/
route.get('/registro-ingresos', servicesIngreso.dataIngresos);

/**
 * @description crear nuevo ingreso
 * @method GET/registro-ingresos-crear
*/
route.get('/registro-ingresos-crear', servicesIngreso.crearIngreso);

/**
 * @description modificar estado de ingreso
 * @method GET/registro-ingresos-modificar
*/
route.get('/registro-ingresos-modificar', servicesIngreso.modificarIngreso);

//API
route.post('/api/ingreso',controllerIngreso.create);
route.get('/api/ingreso',controllerIngreso.find);
route.put('/api/ingreso/:id',controllerIngreso.update);
route.delete('/api/ingreso/:id',controllerIngreso.delete);


module.exports = route;