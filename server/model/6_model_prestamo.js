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
    vecino:{
        type:String,
        required:true
    },
    montoprestado:{
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
        required:true
    },
    montocobrado:{
        type:Number,
        required:true
    },
    documentocobrado:{
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
});

const Prestamodb = mongoose.model('prestamo',schema);

module.exports = Prestamodb;