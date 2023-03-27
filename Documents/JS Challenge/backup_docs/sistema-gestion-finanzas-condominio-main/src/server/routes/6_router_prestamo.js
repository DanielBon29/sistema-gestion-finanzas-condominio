const express = require('express');
const route = express.Router();

const servicesPrestamo = require('../services/6_render_prestamo');
const controllerPrestamo = require('../controller/6_controller_prestamo');

// Prestamo Routes //
/**
 * @description datos de prestamos
 * @method GET/registro-prestamos
*/
route.get('/registro-prestamos', servicesPrestamo.dataPrestamos);

/**
 * @description crear nuevo prestamo
 * @method GET/registro-prestamos-crear
*/
route.get('/registro-prestamos-crear', servicesPrestamo.crearPrestamo);

/**
 * @description modificar estado de prestamo
 * @method GET/registro-prestamos-modificar
*/
route.get('/registro-prestamos-modificar', servicesPrestamo.modificarPrestamo);

//API
route.post('/api/prestamo',controllerPrestamo.create);
route.get('/api/prestamo',controllerPrestamo.find);
route.put('/api/prestamo/:id',controllerPrestamo.update);
route.delete('/api/prestamo/:id',controllerPrestamo.delete);


module.exports = route;