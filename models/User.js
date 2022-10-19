const mongoose = require('mongoose');

const user = new mongoose.Schema({
    first_name:{
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
    phone : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    // mesurment
    height : {
        type : Number,
        required : true
    },
    weight : {
        type : Number,
        required : true
    },
    // goals
    g_weight : {
        type : Number,
        required : true
    },
    goal :{
        type : String,
        required : true
    },
    // personal detail
    job : {
        type : String,
        required : true
    },
    job_type:{
        type : String,
        required : true
    },
    disease :{
        type : String,
        required : true
    },
    age :{
        type : String,
        required : true
    },
    // personal food
    fruit :{
        type : String,
        required : true
    },
    food :{
        type : String,
        required : true
    },
    bad_food : {
        type : String,
        required : true
    },
    Date_of_creation : {
        type : String,
        default : "No Record Found",
        required : true
    },
    // plans
    plan : {
        type : String,
        required : true,
        default : "Free"
    },
    // admin
    type : {
        type : String,
        default : 'user'
    },
    // action
    action :{
        type : String,
        default : 'Free'
    },
    taker : {
        type : String,
        default : 'Free'
    },
    // memberShip
    membership : {
        type : Number,
        default : 0
    },
    profile_image : {
        type : String,
        default : 'not'
    },
     // record images
    image: {
        type : String,
        default : 'Default.jpg'
    },
    week1 : {
        type : String,
        default : 'default.jpg'
    },
    week2 : {
        type : String,
        default : 'default.jpg'
    },
    week3 : {
        type : String,
        default : 'default.jpg'
    },
    week4 : {
        type : String,
        default : 'default.jpg'
    },
    week5 : {
        type : String,
        default : 'default.jpg'
    },
    week6 : {
        type : String,
        default : 'default.jpg'
    },
    week7 : {
        type : String,
        default : 'default.jpg'
    },
    week8 : {
        type : String,
        default : 'default.jpg'
    },
    pro_report : {
        type : String,
        default : 'Just Started'
    },
    // chat
    chat : {
        type : String
    },
    diet : {
        type : Boolean,
        default : true
    },
    // disable 
    disable : {
        type : Boolean,
        default : false
    }
    
})

module.exports = mongoose.model('Users', user);