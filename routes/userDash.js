const express = require('express');
const multer = require('multer');
const path = require('path');
const user = express.Router()
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// bring model
const userDB = require('../models/User');
// chat
const chatDB = require('../models/chat');

// init multer
const storage = multer.diskStorage({
    destination : './public/Client_images/',
    filename : function(req,file,cb){
      cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
  });
  
  // init upload
  const upload = multer({
    storage : storage,
    limits : {fileSize : 1000000},
    fileFilter : function(req,file,cb){
      checkFileType(file,cb);
    }
  }).single('result')
  
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only ! Format Should be in (jpeg | jpg | png)');
    }
  }
  


user.get('/user-report',ensureAuthenticated,(req,res)=>{
    res.render('Dash_report',{
        title : 'Report',
        user : req.user
    })
})

user.post('/upload',(req,res)=>{
    upload(req, res, (err) => {
        if(err){
            var conditionn;
            if(req.user.profile_image == 'not'){
              conditionn = false
            }else{
              conditionn = true
            }
          res.render('dashboard', {
            title : req.user.first_name,
            user : req.user,
            error : err,
            conditionn
          });
        } else {
          if(req.file == undefined){
            var conditionn;
            if(req.user.profile_image == 'not'){
              conditionn = true
            }else{
              conditionn = false
            }
            res.render('dashboard', {
              error : 'Please select Image',
              title : req.user.first_name,
              user : req.user,
              conditionn
            });
          } else {
            var conditionn;
            if(req.user.profile_image == 'not'){
              conditionn = false
            }else{
              conditionn = true
            }
            userDB.updateOne({_id:req.user._id},
                {
                  $set : {profile_image : req.file.filename}
                })
                .exec()
                .then(()=>{
                    res.redirect('/user/dashboard');
                })
          }
        }
      }); 
})


user.get('/upload',(req,res)=>{
    res.redirect('/dashboard');
})

// diet plan
user.get('/diet-plan',ensureAuthenticated,(req,res)=>{
    res.render('Dash_Deit_plan',{
        title : 'Diet plan',
        user : req.user,
        diet : req.user.diet
    })
})

user.post('/chat',(req,res)=>{
  console.log(req.body)
  const message = req.body.message;
  const from = req.user.first_name;
  const id = req.user._id;
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        var d = new Date();
        let date = d.getDate();
        let month = monthNames[d.getMonth()];
        let year = d.getFullYear();
        var hour = d.getHours();
        let mint = d.getMinutes();
        var wish = 'AM'
        if(hour >= 12){
          hour = hour-12;
          var wish = 'PM'
        }
        var when = date+'-'+month+'-'+year+' '+hour+':'+mint+" "+wish;


  const newMessage = new chatDB({message,id,when,from});
  chatDB.find({id:req.user._id},(err,docs)=>{
    if(message == ''){
      res.render('chat',{
        title : 'Chat',
        user : req.user,
        error : 'Please Enter Some Message',
        msg : docs
      })
    }
    newMessage.save()
    .then(()=>{res.redirect('/user/contact-chat42GeT')})
  }).sort({when: 1})

})

user.get('/contact-chat42GeT',ensureAuthenticated,(req,res)=>{
    chatDB.find({id:req.user.taker},(err,doc)=>{
          if(err) throw err;
          if(doc){
              chatDB.find({id:req.user._id},(err,msg)=>{
                if(err) throw err;
                  res.render('chat',{
                      title : 'Chat',
                      user : req.user,
                      sender : doc,
                      msg : msg   
                   })
              }).sort({when: 1})
          }
      })
})

module.exports = user;