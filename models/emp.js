const mongoose = require('mongoose');

const emp = new mongoose.Schema({
    date_of_creation : {
        type : String,
        required : true
    },
    first_name : {
        type : String,
        required : true
    },
    last_name : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    state : {
        type : String,
        required : true
    },
    pin_code : {
        type : Number,
        required : true
    },
    s_status : {
        type : String,
        default : 'New Joining'
    },
    leaves : {
        type : String,
        default : "0"
    },
    education : {
        type : String,
        required : true
    },
    salary : {
        type : String,
        default : "0"
    },
    when : {
        type : String,
        required : true
    },
    specialist :{
        type : String,
        required : true
    },
    type : {
        type : String,
        default : 'emp'
    },
    client : {
        type : String
    }
})

module.exports = mongoose.model('emp',emp);