const mongoose = require('mongoose');
const blog = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    content : {
        type : String,
        required : true
    },
    date_of_Post : {
        type : String,
        required : true   
    },
    image : {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model('blog', blog);