let Cuotadb = require('../model/9_model_valorcuota');

// Cuota Model//
//create and save new cuota
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new valor cuota
    const cuota = new Cuotadb({
        periodo: req.body.periodo,
        cuotamantenimiento: req.body.cuotamantenimiento,
        cuotaestacionamiento: req.body.cuotaestacionamiento,
        fechacreacion: req.body.fechacreacion,
        fechaactualizacion: req.body.fechaactualizacion
    });    

    // Formatting data before inserting to DB//
    cuota.fechacreacion = cuota.fechacreacion.setHours(cuota.fechacreacion.getHours() - 5); //fecha en hora Peru
    cuota.fechaactualizacion = cuota.fechaactualizacion.setHours(cuota.fechaactualizacion.getHours() - 5); //fecha en hora Peru

    //save cuota in the database
    cuota
    .save(cuota)
    .then(data => {
        res.send(data);
        // console.log('data saved');
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all cuotas/ retrieve and return a single cuota
exports.find = (req, res) => {
    if(req.query.anio ) {
        const año = req.query.anio;
        const regex_año = new RegExp(año,'i'); //search periodo by a substring 'año' and i for insensitive
        
        Cuotadb.find({periodo: {$regex: regex_año}})
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found cuota in year ${año}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving cuota in year ${año}`});
        });
    } else {
        Cuotadb.find()
        .then(cuota => {
            res.send(cuota)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving cuota information"
            });
        });
    };
};

//update a new identified cuota by id
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

    Cuotadb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update cuota with ${id}.Maybe cuota not found!`});
            } else {
                res.send(data);
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update cuota information"});
        })
};

//delete a cuota with specified cuota id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Cuotadb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete cuota with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "cuota was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete cuota with id=${id}`});
        })
};