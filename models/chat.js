const mongoose = require('mongoose');

const chat = new mongoose.Schema({
    message : {
        type : String,
        required : true
    },
    id : {
        type : String,
        required : true
    },
    when : {
        type : String,
        required : true
    },
    from : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('Chat',chat);