const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        //mongodb connection string
        // const con = await mongoose.connect(process.env.MONGO_URI);
        const con = await mongoose.connect('mongodb+srv://admin-db:ubYuviD4dJn5etX@tesoreria.peoii.mongodb.net/Tesoreria?retryWrites=true&w=majority');
        
        console.log(`Mongo DB connected: ${con.connection.host}`);
    }catch(err){
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDB;