const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    letra:{
        type:String,
        required:true,
        unique:true
    },
    vecino:{
        type:String,
        required:true
    },
    celular:{
        type:String,
        required:false
    },
    email1:{
        type:String,
        required:false
    },
    email2:{
        type:String,
        required:false
    },
    estacionamiento:{
        type:String,
        required:true
    }
});

const Vecinodb = mongoose.model('vecino',schema);

module.exports = Vecinodb;


