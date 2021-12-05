let Vecinodb = require('../model/1_model_vecino');

// Vecino Model//
//create and save new vecino
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new vecino
    const vecino = new Vecinodb({
        letra: req.body.letra, 
        vecino: req.body.vecino,
        celular: req.body.celular,
        email1: req.body.email1,
        email2: req.body.email2
    });

    
    //save vecino in the database
    vecino
    .save(vecino)
    .then(data => {
        // res.send(data);
        res.redirect('/nuestros-vecinos');
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all vecinos/ retrieve and return a single vecino
exports.find = (req, res) => {
    if(req.query.id) {
        const id = req.query.id;
        
        Vecinodb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found vecino with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving vecino with id ${id}`});
        })
    } else {
        Vecinodb.find()
        .then(vecino => {
            res.send(vecino)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving vecino information"
            });
        });
    };
};

//update a new identified vecino by id
exports.update = (req, res) => {
    if(!req.body){
        return res
            .status(400)
            .send({message: "Data to update can not be empty"});
    };

    const id = req.params.id;

    Vecinodb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update vecino with ${id}.Maybe vecino not found!`});
            } else {
                res.send(data)
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update vecino information"});
        })
};

//delete a vecino with specified vecino id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Vecinodb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete vecino with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "vecino was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete vecino with id=${id}`});
        })
};
