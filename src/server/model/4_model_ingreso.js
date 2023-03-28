const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    documento:{
        type:String,
        required:true,
        unique:true
    },
    fecharegistro:{
        type:String,
        required:true
    },
    nroperacion:{
        type:String,
        required:false
    },
    cuenta:{
        type:String,
        required:true
    },
    vecino:{
        type:String,
        required:true
    },
    monto:{
        type:Number,
        required:true
    },
    concepto:{
        type:String,
        required:true
    },
    periodo:{
        type:String,
        required:true
    },
    detalle:{
        type:String,
        required:false
    },
    estado:{
        type:String,
        required:true
    },
    fechacreacion:{
        type:Date,
        default: Date.now
    },
    fechaactualizacion:{
        type:Date,
        default: Date.now
    },
    estacionamiento:{
        type:String,
        required:true
    },
});

const Ingresodb = mongoose.model('ingreso',schema);

module.exports = Ingresodb;