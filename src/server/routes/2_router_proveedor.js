const express = require('express');
const route = express.Router();

const servicesProveedor = require('../services/2_render_proveedor');
const controllerCC = require('../controller/2_controller_cc');
const controllerProveedor = require('../controller/2_controller_proveedor');

// Proveedor Routes //
/**
 * @description datos de centros de costo
 * @method GET/nuestros-proveedores
*/
route.get('/nuestros-proveedores', servicesProveedor.dataCC_Proveedor);

/**
 * @description crear nuevo proveedor
 * @method GET/nuestros-proveedores-crear
*/
route.get('/nuestros-proveedores-crear', servicesProveedor.crearProveedor);

/**
 * @description modificar datos de proveedor
 * @method GET/nuestros-proveedores-modificar
*/
route.get('/nuestros-proveedores-modificar', servicesProveedor.modificarProveedor);

//API CC
route.post('/api/cc',controllerCC.create);
route.get('/api/cc',controllerCC.find);

//API Proveedor
route.post('/api/proveedor',controllerProveedor.create);
route.get('/api/proveedor',controllerProveedor.find);
route.put('/api/proveedor/:id',controllerProveedor.update);
route.delete('/api/proveedor/:id',controllerProveedor.delete);


module.exports = route;