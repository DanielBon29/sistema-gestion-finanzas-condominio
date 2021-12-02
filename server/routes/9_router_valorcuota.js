const express = require('express');
const route = express.Router();

const controllerCuota = require('../controller/9_controller_valorcuota');

//API
route.post('/api/cuota',controllerCuota.create);
route.get('/api/cuota',controllerCuota.find);
route.put('/api/cuota/:id',controllerCuota.update);
route.delete('/api/cuota/:id',controllerCuota.delete);


module.exports = route;