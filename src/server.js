const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

const connectDB = require('./server/database/connection');

const app = express();

dotenv.config({path:'config.env'});
// const PORT = process.env.PORT || 8080;
const PORT = 3000;

//log requests
app.use(morgan('tiny'));

//mongodb connection
connectDB();

//parse request to body-parser
app.use(bodyParser.urlencoded({extended:true}));

//set view engine
app.set('view engine','ejs');
app.set('views',path.resolve(__dirname,'views'));

//load assets
app.use('/css',express.static(path.resolve(__dirname,'assets/css')));
app.use('/img',express.static(path.resolve(__dirname,'assets/img')));
app.use('/js',express.static(path.resolve(__dirname,'assets/js')));
app.use('/docs', express.static(path.join(__dirname, 'docs')));

//load routers
app.use('/',require('./server/routes/0_router_home'));
app.use('/',require('./server/routes/1_router_vecino'));
app.use('/',require('./server/routes/2_router_proveedor'));
app.use('/',require('./server/routes/3_router_junta'));
app.use('/',require('./server/routes/4_router_ingreso'));
app.use('/',require('./server/routes/5_router_egreso'));
app.use('/',require('./server/routes/6_router_prestamo'));
app.use('/',require('./server/routes/7_router_reportes'));
app.use('/',require('./server/routes/8_router_comprobante'));
app.use('/',require('./server/routes/9_router_valorcuota'));

app.use(function(req, res, next){
    res.status(404);
    res.render('404_not_found');
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/home`);
});


// 2. AVERIGUAR COMO MANIPULAR LA DATA PARA QUE EL REPORTE DE FLUJO PUEDA ENTRAR EN UN EXCEL
