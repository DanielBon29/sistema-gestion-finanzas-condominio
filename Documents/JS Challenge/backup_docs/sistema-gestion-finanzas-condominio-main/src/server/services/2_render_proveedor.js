const axios = require('axios');

//Render Proveedor Routes
exports.dataCC_Proveedor = (req, res) => {
    //Make a get request to /api/cc &  /api/proveedor
    const source1 = axios.get('http://localhost:3000/api/cc');
    const source2 = axios.get('http://localhost:3000/api/proveedor',{params:{centrocosto:req.query.centrocosto}});

    axios.all([source1,source2])
    .then(axios.spread((...responses) => {
        res.render('2_0_nuestros_proveedores',
            {cc:responses[0].data, 
            proveedores:responses[1].data}
        );
    }))
    .catch(err => {
        res.send(err);
    })
};

exports.crearProveedor = (req, res) => {
    axios.get('http://localhost:3000/api/cc')
    .then(function(response) {
        res.render('2_1_nuestros_proveedores_crear',{cc:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.modificarProveedor = (req, res) => {
    axios.get('http://localhost:3000/api/proveedor',{params:{id:req.query.id}})
    .then(function(userdata){
        res.render('2_2_nuestros_proveedores_modificar',{proveedor: userdata.data});
    })
    .catch(err => {
        res.send(err);
    })
};