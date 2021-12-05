let Ingresodb = require('../model/4_model_ingreso');

// Ingreso Model//
//create and save new ingreso
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new ingreso
    const ingreso = new Ingresodb({
        documento: req.body.documento, 
        fecharegistro: req.body.fecharegistro,
        nroperacion: req.body.nroperacion,
        cuenta: req.body.cuenta,
        vecino: req.body.vecino,
        monto: req.body.monto,
        concepto: req.body.concepto,
        periodo: req.body.periodo,
        detalle: req.body.detalle,
        estado: req.body.estado,
        fechacreacion: req.body.fechacreacion,
        fechaactualizacion: req.body.fechaactualizacion
    });    

    // Formatting data before inserting to DB//
    let reg_dd = ingreso.fecharegistro.slice(3,5);
    let reg_MM = ingreso.fecharegistro.slice(0,2);
    let reg_yyyy = ingreso.fecharegistro.slice(-4);

    ingreso.fecharegistro = `${reg_dd}/${reg_MM}/${reg_yyyy}`; //Formatear la cadena en modo "dd/MM/yyyy"
    (ingreso.nroperacion == "")? ingreso.nroperacion = "S/N": ingreso.nroperacion; //Si no hay nro de operacion, entonces "S/N"
    ingreso.fechacreacion = ingreso.fechacreacion.setHours(ingreso.fechacreacion.getHours() - 5); //fecha en hora Peru
    ingreso.fechaactualizacion = ingreso.fechaactualizacion.setHours(ingreso.fechaactualizacion.getHours() - 5); //fecha en hora Peru

    //save ingreso in the database
    ingreso
    .save(ingreso)
    .then(data => {
        // res.send(data);
        // console.log('data saved');
        res.redirect('/comprobante-ingreso-creado?id='+data._id);
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all ingresos/ retrieve and return a single ingreso
exports.find = (req, res) => {
    if(req.query.concepto && req.query.anio ) {
        const concepto = req.query.concepto;
        const año = req.query.anio;
        const regex_año = new RegExp(año,'i'); //search periodo by a substring 'año' and i for insensitive
        
        Ingresodb.find({concepto}).find({periodo: {$regex: regex_año}})
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found ingreso with concepto ${concepto} in year ${año}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving ingreso with concepto ${concepto} in year ${año}`});
        });
    } else if(req.query.flujo ) {
        const año = req.query.flujo;
        const regex_año = new RegExp(año,'i'); //search periodo by a substring 'año' and i for insensitive
        
        Ingresodb.find({fecharegistro: {$regex: regex_año}})
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found ingreso register in year ${año}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving ingreso register in year ${año}`});
        });
    } else if (req.query.id) {
        const id = req.query.id;
        
        Ingresodb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found ingreso with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving ingreso with id ${id}`});
        });
    } else {
        Ingresodb.find()
        .then(ingreso => {
            res.send(ingreso)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving ingreso information"
            });
        });
    };
};

//update a new identified ingreso by id
exports.update = (req, res) => {
    if(!req.body){
        return res
            .status(400)
            .send({message: "Data to update can not be empty"});
    };

    const id = req.params.id;

    // Set Current Date in DB every update of data
    let currentDateUTC = new Date();
    req.body.fechaactualizacion = currentDateUTC.setHours(currentDateUTC.getHours() - 5); //To UTC -5 (Lima, Perú)
    // Formatting data before inserting to DB//
    (req.body.nroperacion == "")? req.body.nroperacion = "S/N": req.body.nroperacion; //Si no hay nro de operacion, entonces "S/N"

    Ingresodb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update ingreso with ${id}.Maybe ingreso not found!`});
            } else {
                res.send(data);
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update ingreso information"});
        })
};

//delete a ingreso with specified ingreso id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Ingresodb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete ingreso with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "ingreso was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete ingreso with id=${id}`});
        })
};