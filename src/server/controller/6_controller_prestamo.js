let Prestamodb = require('../model/6_model_prestamo');

// Prestamo Model//
//create and save new prestamo
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new prestamo
    const prestamo = new Prestamodb({
        documento: req.body.documento, 
        fecharegistro: req.body.fecharegistro,
        vecino: req.body.vecino,
        montoprestado: req.body.montoprestado,
        concepto: req.body.concepto,
        periodo: req.body.periodo,
        detalle: req.body.detalle,
        montocobrado: req.body.montocobrado,
        documentocobrado: req.body.documentocobrado, 
        estado: req.body.estado,
        fechacreacion: req.body.fechacreacion,
        fechaactualizacion: req.body.fechaactualizacion
    });    

    // Formatting data before inserting to DB//
    let reg_dd = prestamo.fecharegistro.slice(3,5);
    let reg_MM = prestamo.fecharegistro.slice(0,2);
    let reg_yyyy = prestamo.fecharegistro.slice(-4);

    prestamo.fecharegistro = `${reg_dd}/${reg_MM}/${reg_yyyy}`; //Formatear la cadena en modo "dd/MM/yyyy"
    prestamo.fechacreacion = prestamo.fechacreacion.setHours(prestamo.fechacreacion.getHours() - 5); //fecha en hora Peru
    prestamo.fechaactualizacion = prestamo.fechaactualizacion.setHours(prestamo.fechaactualizacion.getHours() - 5); //fecha en hora Peru

    //save prestamo in the database
    prestamo
    .save(prestamo)
    .then(data => {
        // res.send(data);
        // console.log('data saved');
        res.redirect('/registro-prestamos');
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all prestamos/ retrieve and return a single prestamo
exports.find = (req, res) => {
    if (req.query.id) {
        const id = req.query.id;
        
        Prestamodb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found prestamo with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving prestamo with id ${id}`});
        });
    } else {
        Prestamodb.find()
        .then(prestamo => {
            res.send(prestamo)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving prestamo information"
            });
        });
    };
};

//update a new identified prestamo by id
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

    Prestamodb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update prestamo with ${id}.Maybe prestamo not found!`});
            } else {
                res.send(data);
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update prestamo information"});
        })
};

//delete a prestamo with specified prestamo id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Prestamodb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete prestamo with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "prestamo was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete prestamo with id=${id}`});
        })
};