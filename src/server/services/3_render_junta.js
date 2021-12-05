const axios = require('axios');

//Render Juntas Route pages
exports.dataJuntas = (req, res) => {
    //Make a get request to /api/juntas
    axios.get('http://localhost:3000/api/junta')
    .then(function(response) {
        res.render('3_0_junta_directiva',{juntas:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.crearJunta = (req, res) => {
    //Make a get request to /api/juntas
    axios.get('http://localhost:3000/api/junta')
    .then(function(response) {
        let todos_años = []; //array con todos los años disponibles para juntas
        let año_inicial = 2000;
        let año_final = new Date().getFullYear() + 1; // 1 año más que el actual

        for(let i = año_inicial; i <= año_final; i++) {
            todos_años.push(i);
        };

        let años_junta = [...new Set(response.data.map(item => item.año))]; // Array con los años de juntas ya creadas
        let años_combo = todos_años.filter(item => !años_junta.includes(item));
        años_combo.sort((a,b) => (a > b) ? -1 : ((b > a) ? 1 : 0)) // data sorting by "año" desc
        
        res.render('3_1_junta_directiva_crear',{años:años_combo});
    })
    .catch(err => {
        res.send(err);
    })
};

exports.modificarJunta = (req, res) => {
    axios.get('http://localhost:3000/api/junta',{params:{id:req.query.id}})
    .then(function(userdata){
        res.render('3_2_junta_directiva_modificar',{junta: userdata.data});
    })
    .catch(err => {
        res.send(err);
    })
};