const mongoose = require('mongoose');

function connectDB(URI){
    mongoose.connect(URI).then(() =>{
        console.log("DB is connecting");
    }).catch((err)=>{
        console.log(err);
    });
}

module.exports = connectDB;