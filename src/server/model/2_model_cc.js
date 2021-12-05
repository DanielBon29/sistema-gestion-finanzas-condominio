const mongoose = require('mongoose');

let schema = new mongoose.Schema({
    codigo:{
        type:String,
        required:true,
        unique:true
    },
    centrocosto:{
        type:String,
        required:true,
        unique:true
    }
});

const CCdb = mongoose.model('centro de costo',schema);

module.exports = CCdb;


