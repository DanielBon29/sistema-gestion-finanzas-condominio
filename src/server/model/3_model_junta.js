const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    año:{
        type:Number,
        required:true,
        unique:true
    },
    presidencia:{
        type:String,
        required:true
    },
    tesoreria:{
        type:String,
        required:true
    },
    secretaria:{
        type:String,
        required:true
    },
    administracion:{
        type:String,
        required:false
    }
});

const Juntadb = mongoose.model('junta',schema);

module.exports = Juntadb;