const axios = require('axios');

//Render Egresos Route pages
exports.dataEgresos = (req, res) => {
    //Make a get request to /api/egreso
    axios.get('http://localhost:3000/api/egreso')
    .then(function(response) {
        res.render('5_0_registro_egresos',{egresos:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.crearEgreso = (req, res) => {
    //Make a get request to /api/users &  /api/egreso
    const source1 = axios.get('http://localhost:3000/api/cc');
    const source2 = axios.get('http://localhost:3000/api/proveedor');
    const source3 = axios.get('http://localhost:3000/api/egreso');

    axios.all([source1,source2,source3])
    .then(axios.spread((...responses) => {
        res.render('5_1_registro_egresos_crear',
        {cc:responses[0].data, 
            proveedores:responses[1].data,
            egresos:responses[2].data}
        );
    }))
    .catch(err => {
        res.send(err);
    })
};

exports.modificarEgreso = (req, res) => {
    axios.get('http://localhost:3000/api/egreso',{params:{id:req.query.id}})
    .then(function(userdata){
        res.render('5_3_registro_egresos_modificar',{egreso: userdata.data});
    })
    .catch(err => {
        res.send(err);
    })
};