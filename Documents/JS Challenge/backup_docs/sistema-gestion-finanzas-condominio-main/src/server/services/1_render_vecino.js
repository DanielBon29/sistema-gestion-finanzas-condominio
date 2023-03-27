const axios = require('axios');

//Render Vecinos Route pages
exports.dataVecinos = (req, res) => {
    //Make a get request to /api/users
    axios.get('http://localhost:3000/api/users')
    .then(function(response) {
        res.render('1_0_nuestros_vecinos',{users:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.crearVecino = (req, res) => {
    res.render('1_1_nuestros_vecinos_crear');
};

exports.modificarVecino = (req, res) => {
    axios.get('http://localhost:3000/api/users',{params:{id:req.query.id}})
    .then(function(userdata){
        res.render('1_2_nuestros_vecinos_modificar',{user: userdata.data});
    })
    .catch(err => {
        res.send(err);
    })
};
