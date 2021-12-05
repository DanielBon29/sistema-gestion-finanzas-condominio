const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    centrocosto:{
        type:String,
        required:true
    },
    proveedor:{
        type:String,
        required:true
    },
    documento:{
        type:String,
        required:false
    },
    direccion:{
        type:String,
        required:false
    },
    celular:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    }
});

const Proveedordb = mongoose.model('proveedor',schema);

module.exports = Proveedordb;


