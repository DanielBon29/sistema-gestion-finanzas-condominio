const axios = require('axios');

//Render Ingresos Route pages
exports.dataIngresos = (req, res) => {
    //Make a get request to /api/ingreso
    axios.get('http://localhost:3000/api/ingreso')
    .then(function(response) {
        res.render('4_0_registro_ingresos',{ingresos:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.crearIngreso = (req, res) => {
    //Make a get request to /api/users &  /api/ingreso
    const source1 = axios.get('http://localhost:3000/api/users');
    const source2 = axios.get('http://localhost:3000/api/ingreso');

    axios.all([source1,source2])
    .then(axios.spread((...responses) => {
        res.render('4_1_registro_ingresos_crear',
        {vecinos:responses[0].data, 
            ingresos:responses[1].data}
        );
    }))
    .catch(err => {
        res.send(err);
    })
};

exports.modificarIngreso = (req, res) => {
    axios.get('http://localhost:3000/api/ingreso',{params:{id:req.query.id}})
    .then(function(userdata){
        res.render('4_3_registro_ingresos_modificar',{ingreso: userdata.data});
    })
    .catch(err => {
        res.send(err);
    })
};