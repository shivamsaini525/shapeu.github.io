const express = require('express');
const multer  = require('multer');
const path = require('path');
const dash = express.Router();
const { ensureAuthenticated } = require('../config/auth');


const userDB = require('../models/User');
const blogDB = require('../models/blogs');
const chatDB = require('../models/chat');



// multer
const storage = multer.diskStorage({
    destination : './public/Blogs/',
    filename : function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})

// inin upload
const upload = multer({
    storage : storage,
    limits : {fileSize : 1000000},
    fileFilter : function(req,file,cb){checkFileType(file,cb);}
}).single('blog')


function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|HEIC/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Images Only ! Format Should be in (jpeg | jpg | png)');
    }
  }

dash.get('/profile',ensureAuthenticated,(req,res)=>{
    res.render('profile',{
        title : 'Profile',
        user : req.user
    })
})

dash.get('/write-blog',ensureAuthenticated,(req,res)=>{
    res.render('Write_blog',{
        title : 'Write Blog',
        user : req.user,
    })
})



// post API
dash.post('/write-blog',ensureAuthenticated,(req,res)=>{
   upload(req,res,(err)=>{
       if(err){
           res.render('Write_blog',{
            title : 'Write Blog',
            user : req.user,
            error : err
           })
       }else{
           if(req.file == undefined){
            res.render('Write_blog',{
                title : 'Write Blog',
                user : req.user,
                error : 'Please Select Images!!'
               })
           }else{
               const {title,content} = req.body;
               const image = req.file.filename;
               const author = req.user.first_name;
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
        if(hour > 12){
          hour = hour-12;
          var wish = 'PM'
        }
        var when = date+'-'+month+'-'+year+' '+hour+':'+mint+" "+wish;
               const date_of_Post = when;
               const newBlog = new blogDB({title,content,image,author,date_of_Post})
               newBlog.save()
               .then(()=>{
                   res.render('Write_blog',{
                       title : "Write Blog",
                       user : req.user,
                       error : 'Blog Posted Sucessfully.'
                   })
               })
           }
       }
   })
})





dash.get('/requests',ensureAuthenticated,(req,res)=>{
    userDB.find({action:'Free'},(err,docs)=>{
        if(err) throw err;
        res.render('Client_request',{
            title : 'Client Request',
            docs : docs,
            user : req.user,
        })
        
    })
})

dash.get('/salary',ensureAuthenticated,(req,res)=>{
    userDB.countDocuments({taker:req.user._id},(err,count)=>{
        if(err) throw err;
        var salary = 6.9*count;
        if(count){
            res.render('wallet',{
                title : 'Salary',
                user: req.user,
                count : count,
                salary : salary
            })
        }else{
            res.render('wallet',{
                title : 'Salary',
                user: req.user,
                count : 0,
                salary : 0
            })
        }
    })
})

dash.get('/reports',ensureAuthenticated,(req,res)=>{
    userDB.find({taker:req.user._id},(err,docs)=>{
        if(err) throw err;
        if(!docs){
            res.render('client_report',{
                title : 'Reports',
                user : req.user,
                error : 'You Dont Have Any Clients Make Some Clients'
            })
        }else{
            res.render('client_report',{
                title : 'Reports',
                docs : docs,
                user : req.user
            })
        }
    })
})


// action page for reserved client
dash.post('/take/action',ensureAuthenticated,(req,res)=>{
    const {action,id,taker} = req.body;
    userDB.updateOne({_id:id},
        {
            $set : {action : action,taker : taker}
        })
        .exec()
        .then(result =>{res.redirect('/emp/requests')})  
})

// private clinet
dash.get('/pre-client',ensureAuthenticated,(req,res)=>{
    userDB.find({taker:req.user._id},(err,docs)=>{
        if(err) throw err;
        res.render('EmpClient',{
            title : 'Clients',
            docs : docs,
            user : req.user
        })
    })
})

dash.get('/diet-plan-upload-client',ensureAuthenticated,(req,res)=>{
    res.render('Diet_plan',{
        title : 'Diet Plan',
        user : req.user
    })
})

dash.get('/excersie-plan-upload-client',ensureAuthenticated,(req,res)=>{
    res.render('Excer_plan',{
        title : 'Excersie Plan',
        user : req.user
    })
})

dash.get('/chat',ensureAuthenticated,(req,res)=>{
    userDB.find({taker : req.user._id},(err,docs)=>{
        if(err) throw err;
        if(!docs){
            var docss=1,docs=1;
            res.render('Client_chat',{
                title : 'Chat',
                user : req.user,
                sender : docss,
                msg : docs,
                Error : 'You Dont Have Any Client Make Some Clinet'
            })
        }
        if(docs){
            const id = docs._id
        chatDB.find({id:id},(err,docss)=>{
            if(err) throw err;
            if(docss){
                chatDB.find({id:req.user._id},(err,msg)=>{
                    res.render('Client_chat',{
                        title : 'Chat',
                        user : req.user,
                        sender : docss,
                        msg : msg   
                     })
                }).sort({when: -1})
            }
        })
    }
    })
})

dash.post('/chat',ensureAuthenticated,(req,res)=>{
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
          msg : docs,
          sender : docs
        })
      }
      newMessage.save()
      .then(()=>{res.redirect('/emp/chat')})
    }).sort({when: 1})
  
  })


module.exports = dash;