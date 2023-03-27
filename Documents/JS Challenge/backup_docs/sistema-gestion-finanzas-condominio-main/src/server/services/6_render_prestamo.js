const axios = require('axios');

//Render Prestamos Route pages
exports.dataPrestamos = (req, res) => {
    //Make a get request to /api/prestamo
    axios.get('http://localhost:3000/api/prestamo')
    .then(function(response) {
        res.render('6_0_registro_prestamos',{prestamos:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.crearPrestamo = (req, res) => {
    //Make a get request to /api/users &  /api/prestamo &  /api/ingreso
    const source1 = axios.get('http://localhost:3000/api/users');
    const source2 = axios.get('http://localhost:3000/api/prestamo');

    axios.all([source1,source2])
    .then(axios.spread((...responses) => {
        res.render('6_1_registro_prestamos_crear',
        {vecinos:responses[0].data,
        prestamos:responses[1].data}
        );
    }))
    .catch(err => {
        res.send(err);
    })
};

exports.modificarPrestamo = (req, res) => {
    //Make a get request to /api/prestamo &  /api/ingreso
    const source1 = axios.get('http://localhost:3000/api/prestamo',{params:{id:req.query.id}});
    const source2 = axios.get('http://localhost:3000/api/ingreso');

    axios.all([source1,source2])
    .then(axios.spread((...responses) => {
        res.render('6_2_registro_prestamos_modificar',
        {prestamo:responses[0].data, 
        ingresos:responses[1].data}
        );
    }))
    .catch(err => {
        res.send(err);
    })
};