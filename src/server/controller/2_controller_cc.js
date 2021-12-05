let CCdb = require('../model/2_model_cc');

// Centro de Costo Model//
//create and save new centro de costo
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new centro de costo
    const cc = new CCdb({
        codigo: req.body.codigo, 
        centrocosto: req.body.centrocosto
    });

    //save centro de costo in the database
    cc
    .save(cc)
    .then(data => {
        // res.send(data);
        res.redirect('/nuestros-proveedores');
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all Centros de costo/ retrieve and return a single centro de costo
exports.find = (req, res) => {
    if(req.query.id) {
        const id = req.query.id;
        
        CCdb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found centro de costo with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving centro de costo with id ${id}`});
        })
    } else {
        CCdb.find()
        .then(cc => {
            res.send(cc)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving centro de costo information"
            });
        });
    };
};