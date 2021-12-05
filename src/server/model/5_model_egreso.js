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
    nrcomprobante:{
        type:String,
        required:false
    },
    centrocosto:{
        type:String,
        required:true
    },
    proveedor:{
        type:String,
        required:true
    },
    monto:{
        type:Number,
        required:true
    },
    cuenta:{
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
});

const Egresodb = mongoose.model('egreso',schema);

module.exports = Egresodb;