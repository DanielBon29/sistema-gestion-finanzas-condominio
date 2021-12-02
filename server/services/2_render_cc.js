const axios = require('axios');

//Render CC Route pages
exports.dataCC = (req, res) => {
    //Make a get request to /api/cc
    axios.get('http://localhost:3000/api/cc')
    .then(function(response) {
        res.render('nuestros_proveedores',{cc:response.data});
    })
    .catch(err => {
        res.send(err);
    })
};