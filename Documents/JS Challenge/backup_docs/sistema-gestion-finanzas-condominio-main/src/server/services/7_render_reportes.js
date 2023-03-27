const axios = require('axios');

//Render Reportes Page
exports.reporteRoutes = (req, res) => {
    res.render('7_0_reportes');
};

//Render Morosidad Mensual Routes
exports.reporteMorosidad = (req, res) => {
    //Make a get request to /api/users &  /api/ingreso &  /api/cuota

    const source1 = axios.get('http://localhost:3000/api/users');
    const source2 = axios.get(`http://localhost:3000/api/ingreso?concepto=${req.query.concepto}&anio=${req.query.anio}`);
    const source3 = axios.get(`http://localhost:3000/api/cuota?anio=${req.query.anio}`);
    const source4 = axios.get('http://localhost:3000/api/ingreso');

    axios.all([source1,source2,source3,source4])
    .then(axios.spread((...responses) => {
        let ing_fijos = responses[3].data.filter(item => item.concepto == 'Mantenimiento Mensual' || item.concepto == 'Estacionamiento Mensual');
 
        res.render('7_1_reporte_morosidad',
            {vecinos:responses[0].data, 
            ingresos:responses[1].data,
            cuotas:responses[2].data,
            años_ing:[...new Set(ing_fijos.map(item => item.periodo.substring(0,4)))],
            año_actual: [String(new Date().getFullYear())] //para asegurar que el combo box del año muestre el año actual
            }
        );
    }))
    .catch(err => {
        res.send(err);
    })
};

//Render Deudas por cobrar Routes
exports.reporteDeudas = (req, res) => {
    //Make a get request to /api/users &  /api/prestamo

    const source1 = axios.get('http://localhost:3000/api/users');
    const source2 = axios.get('http://localhost:3000/api/prestamo');

    axios.all([source1,source2])
    .then(axios.spread((...responses) => {
        res.render('7_2_reporte_deudas',
            {vecinos:responses[0].data, 
            prestamos:responses[1].data}
        );
    }))
    .catch(err => {
        res.send(err);
    })
};

//Render Flujo Routes
exports.reporteFlujo = (req, res) => {
    //Make a get request to /api/users &  /api/ingreso
    const source1 = axios.get(`http://localhost:3000/api/ingreso?flujo=${req.query.flujo}`);
    const source2 = axios.get(`http://localhost:3000/api/egreso?flujo=${req.query.flujo}`);
    const source3 = axios.get('http://localhost:3000/api/cc');
    const source4 = axios.get('http://localhost:3000/api/ingreso');
    const source5 = axios.get('http://localhost:3000/api/egreso');
    
    axios.all([source1,source2,source3,source4,source5])
    .then(axios.spread((...responses) => {
        res.render('7_3_reporte_flujo',
            {ingresos:responses[0].data, 
            egresos:responses[1].data,
            cc:responses[2].data,
            años_ing:[...new Set(responses[3].data.map(item => item.fecharegistro.substring(6,10)))],
            años_eg:[...new Set(responses[4].data.map(item => item.fecharegistro.substring(6,10)))]
            }
        );
    }))
    .catch(err => {
        res.send(err);
    })
};