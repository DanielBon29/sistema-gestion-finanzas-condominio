const express = require('express');
const route = express.Router();

const servicesJunta = require('../services/3_render_junta');
const controllerJunta = require('../controller/3_controller_junta');

// Junta Routes //
/**
 * @description datos de juntas
 * @method GET/junta-directiva
*/
route.get('/junta-directiva', servicesJunta.dataJuntas);

/**
 * @description crear nueva junta
 * @method GET/junta-directiva-crear
*/
route.get('/junta-directiva-crear', servicesJunta.crearJunta);

/**
 * @description modificar datos de junta
 * @method GET/junta-directiva-modificar
*/
route.get('/junta-directiva-modificar', servicesJunta.modificarJunta);

//API
route.post('/api/junta',controllerJunta.create);
route.get('/api/junta',controllerJunta.find);
route.put('/api/junta/:id',controllerJunta.update);
route.delete('/api/junta/:id',controllerJunta.delete);


module.exports = route;