let Egresodb = require('../model/5_model_egreso');

// Egreso Model//
//create and save new egreso
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new egreso
    const egreso = new Egresodb({
        documento: req.body.documento, 
        fecharegistro: req.body.fecharegistro,
        nrcomprobante: req.body.nrcomprobante,
        centrocosto: req.body.centrocosto,
        proveedor: req.body.proveedor,
        monto: req.body.monto,
        cuenta: req.body.cuenta,    
        periodo: req.body.periodo,
        detalle: req.body.detalle,
        estado: req.body.estado,
        fechacreacion: req.body.fechacreacion,
        fechaactualizacion: req.body.fechaactualizacion
    });    

    // Formatting data before inserting to DB//
    let reg_dd = egreso.fecharegistro.slice(3,5);
    let reg_MM = egreso.fecharegistro.slice(0,2);
    let reg_yyyy = egreso.fecharegistro.slice(-4);

    egreso.fecharegistro = `${reg_dd}/${reg_MM}/${reg_yyyy}`; //Formatear la cadena en modo "dd/MM/yyyy"
    (egreso.nrcomprobante == "")? egreso.nrcomprobante = "S/N": egreso.nrcomprobante; //Si no hay nro de comprobante, entonces "S/N"
    egreso.fechacreacion = egreso.fechacreacion.setHours(egreso.fechacreacion.getHours() - 5); //fecha en hora Peru
    egreso.fechaactualizacion = egreso.fechaactualizacion.setHours(egreso.fechaactualizacion.getHours() - 5); //fecha en hora Peru

    //save egreso in the database
    egreso
    .save(egreso)
    .then(data => {
        // res.send(data);
        res.redirect('/comprobante-egreso-creado?id='+data._id);
        // res.redirect('/registro-egresos');
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all egresos/ retrieve and return a single egreso
exports.find = (req, res) => {
    if(req.query.flujo ) {
        const año = req.query.flujo;
        const regex_año = new RegExp(año,'i'); //search periodo by a substring 'año' and i for insensitive
        
        Egresodb.find({fecharegistro: {$regex: regex_año}})
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found egreso register in year ${año}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving egreso register in year ${año}`});
        });
    } else if (req.query.id) {
        const id = req.query.id;
        
        Egresodb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found egreso with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving egreso with id ${id}`});
        });
    } else {
        Egresodb.find()
        .then(egreso => {
            res.send(egreso)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving egreso information"
            });
        });
    };
};

//update a new identified egreso by id
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
    (req.body.nrcomprobante == "")? req.body.nrcomprobante = "S/N": req.body.nrcomprobante; //Si no hay nro de comprobante, entonces "S/N"

    Egresodb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update egreso with ${id}.Maybe egreso not found!`});
            } else {
                res.send(data);
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update egreso information"});
        })
};

//delete a egreso with specified egreso id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Egresodb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete egreso with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "egreso was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete egreso with id=${id}`});
        })
};