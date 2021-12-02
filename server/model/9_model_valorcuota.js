const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    periodo:{
        type:String,
        required:true
    },
    cuotamantenimiento:{
        type:Number,
        required:true
    },
    cuotaestacionamiento:{
        type:Number,
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

const  Cuotadb = mongoose.model('valor_cuota',schema);

module.exports = Cuotadb;