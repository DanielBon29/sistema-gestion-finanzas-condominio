let Proveedordb = require('../model/2_model_proveedor');

// Proveedor Model//
//create and save new proveedor
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new proveedor
    const proveedor = new Proveedordb({
        centrocosto: req.body.centrocosto, 
        proveedor: req.body.proveedor,
        documento: req.body.documento,
        direccion: req.body.direccion,
        celular: req.body.celular,
        email: req.body.email,
    });

    // Formatting data before inserting to DB//
    let arr_prov = proveedor.proveedor.split(" ");
    let arr_dir = proveedor.direccion.split(" ");

    for (let i=0; i<arr_prov.length; i++) {
        arr_prov[i] = arr_prov[i].charAt(0).toUpperCase() + arr_prov[i].slice(1).toLowerCase(); 
    };
    for (let i=0; i<arr_dir.length; i++) {
        arr_dir[i] = arr_dir[i].charAt(0).toUpperCase() + arr_dir[i].slice(1).toLowerCase(); 
    };

    let prov_formatted = arr_prov.join(" ");
    let dir_formatted = arr_dir.join(" ");

    proveedor.proveedor = prov_formatted;
    proveedor.direccion = dir_formatted;
    proveedor.email = proveedor.email.toLowerCase();
    
    //save proveedor in the database
    proveedor
    .save(proveedor)
    .then(data => {
        // res.send(data);
        res.redirect('/nuestros-proveedores?centrocosto='+proveedor.centrocosto);
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all proveedores/ retrieve and return a single proveedor
exports.find = (req, res) => {
    if(req.query.centrocosto) {
        const centrocosto = req.query.centrocosto;
        
        Proveedordb.find({centrocosto})
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found proveedor with centro de costo ${centrocosto}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving proveedor with centro de costo ${centrocosto}`});
        });
    } else if (req.query.id) {
        const id = req.query.id;
        
        Proveedordb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found proveedor with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving proveedor with id ${id}`});
        });
    } else {
        Proveedordb.find()
        .then(proveedor => {
            res.send(proveedor)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving proveedor information"
            });
        });
    };
};

//update a new identified proveedor by id
exports.update = (req, res) => {
    if(!req.body){
        return res
            .status(400)
            .send({message: "Data to update can not be empty"});
    };

    const id = req.params.id;

    Proveedordb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update proveedor with ${id}.Maybe proveedor not found!`});
            } else {
                res.send(data)
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update proveedor information"});
        })
};

//delete a proveedor with specified proveedor id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Proveedordb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete proveedor with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "proveedor was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete proveedor with id=${id}`});
        })
};