let Juntadb = require('../model/3_model_junta');

// Junta Model//
//create and save new junta
exports.create = (req, res) => {
    //validate request
    if(!req.body){
        res.status(400).send({message:"Content can not be empty!"});
        return;
    };

    //new junta
    const junta = new Juntadb({
        año: req.body.año, 
        presidencia: req.body.presidencia,
        tesoreria: req.body.tesoreria,
        secretaria: req.body.secretaria,
        administracion: req.body.administracion
    });

    //save junta in the database
    junta
    .save(junta)
    .then(data => {
        // res.send(data);
        res.redirect('/junta-directiva');
    })
    .catch(err => {
        res.status(500).send({
            message:err.message || "Some error occurred while creating a create operation"
        });
    });
};

//retrieve and return all juntas/ retrieve and return a single junta
exports.find = (req, res) => {
    if(req.query.id) {
        const id = req.query.id;
        
        Juntadb.findById(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Not found junta with id=${id}`});
            } else {
                res.send(data)  
            };
        })
        .catch(err => {
            res.status(500).send({message: `Error retrieving junta with id ${id}`});
        })
    } else {
        Juntadb.find()
        .then(junta => {
            res.send(junta)
        })
        .catch(err => {
            res.status(500).send({
                message:err.message || "Error Occurred while retriving junta information"
            });
        });
    };
};

//update a new identified junta by id
exports.update = (req, res) => {
    if(!req.body){
        return res
            .status(400)
            .send({message: "Data to update can not be empty"});
    };

    const id = req.params.id;

    Juntadb.findByIdAndUpdate(id,req.body)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Update junta with ${id}.Maybe junta not found!`});
            } else {
                res.send(data);
            };
        })
        .catch(err => {
            res.status(500).send({message: "Error Update junta information"});
        })
};

//delete a junta with specified junta id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Juntadb.findByIdAndDelete(id)
        .then(data => {
            if(!data) {
                res.status(404).send({message: `Cannot Delete junta with ${id}.Maybe id wrong!`});
            } else {
                res.send({message: "junta was deleted successfully!"});
            };
        })
        .catch(err => {
            res.status(500).send({message: `Could not delete junta with id=${id}`});
        })
};