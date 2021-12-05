const express = require('express');
const route = express.Router();

const servicesVecino = require('../services/1_render_vecino');
const controllerVecino = require('../controller/1_controller_vecino');

// Vecino Routes //
/**
 * @description datos de vecinos
 * @method GET/nuestros-vecinos
*/
route.get('/nuestros-vecinos', servicesVecino.dataVecinos);

/**
 * @description crear nuevo vecino
 * @method GET/nuestros-vecinos-crear
*/
route.get('/nuestros-vecinos-crear', servicesVecino.crearVecino);

/**
 * @description modificar datos de vecino
 * @method GET/nuestros-vecinos-modificar
*/
route.get('/nuestros-vecinos-modificar', servicesVecino.modificarVecino);


//API
route.post('/api/users',controllerVecino.create);
route.get('/api/users',controllerVecino.find);
route.put('/api/users/:id',controllerVecino.update);
route.delete('/api/users/:id',controllerVecino.delete);

module.exports = route;