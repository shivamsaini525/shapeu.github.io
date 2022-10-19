const mongoose = require('mongoose');
const admin = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    date_of_creation : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    type : {
        type : String,
        default : 'admin'
    }
})

module.exports = mongoose.model('Admin',admin);