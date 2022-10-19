const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const index = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


const userDB = require('../models/User');
const messageDB = require('../models/message');
const empDB = require('../models/emp');
const adminDB = require('../models/admin');

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
  limits : {fileSize : 9999999},
  fileFilter : function(req,file,cb){
    checkFileType(file,cb);
  }
}).single('result')


// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

// Welcome Page
index.get('/', forwardAuthenticated, (req, res) => 
res.render('index',{
  condition : true,
  title : 'ShapeYou'
})
);


// Dashboard
index.get('/dashboard', ensureAuthenticated, (req, res) =>{
  var conditionn;
  if(req.user.profile_image == 'not'){
    conditionn = true
  }else{
    conditionn = false
  }
  res.render('dashboard',{
    condition : false,
    user : req.user,
    title : req.user.first_name,
    file : `/Client_images/${req.user.profile_image}`,
    conditionn
  })
});

// login get
index.get('/login',(req,res)=>{
  res.render('login',{
    condition : false,
    title : 'Sign in'
  });
})

// Login post
index.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});

// logout
index.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/');
});

index.get('/user-signup',(req,res)=>{
 res.render('index_sign_up',{
    condition : true,
    title : 'Sign up'
 })
})

// registrion algo
index.post('/user-signup',(req,res)=>{
  var date = new Date();
  var todayDate = date.getDate();
  var trialDate = todayDate+7;
  if(trialDate >= 32){
    var updatedDate = trialDate-31;
  }
  else{
    var updatedDate = trialDate
  }
  var membership = updatedDate;
  console.log(membership);
  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
  ];
  let datee = date.getDate();
  let month = monthNames[date.getMonth()];
  let year = date.getFullYear();
  Date_of_creation = datee+'-'+month+'-'+year;
  upload(req,res,(err)=>{
  if(err) throw err;
  console.log(req.file.filename);
  const image = req.file.filename;
  const {first_name,last_name,password,C_password,email,height,weight,g_weight,goal,phone,plan,job,job_type,disease,age,fruit,food,bad_food} = req.body;
  const newUser = new userDB({first_name,last_name,password,email,height,weight,g_weight,goal,phone,plan,job,job_type,disease,age,fruit,food,bad_food,Date_of_creation,image, membership});
  let errors = [];
  if(password != C_password){
      errors.push({msg : 'Password Not Matching'})
  }
  if (errors.length > 0) {
      res.render('index_sign_up', {
          title : 'Sign up',
          condition : true,
          errors,first_name,last_name,email,height,weight,g_weight,goal,phone,plan,job,job_type,disease,age,fruit,food,bad_food
      });
  }
  adminDB.findOne({email:email},(err,docs)=>{
    if(docs){res.render('index_sign_up',{
      title:'Sign up',
      error:'That Email is Already Present',
      condition : true,
      first_name,last_name,email,height,weight,g_weight,goal,phone,plan,job,job_type,disease,age,fruit,food,bad_food
    })}
    else{
      userDB.findOne({email:email},(err,docs)=>{
        if(docs){res.render('index_sign_up',{
          title:'Sign up',
          error:'That Email is Already Present',
          condition : true,
          first_name,last_name,email,height,weight,g_weight,goal,phone,plan,job,job_type,disease,age,fruit,food,bad_food
        })}
        else{
          empDB.findOne({email:email},(err,docs)=>{
            if(docs){res.render('index_sign_up',{
              title:'Sign up',
              error:'That Email is Already Present',
              condition : true,
              first_name,last_name,email,height,weight,g_weight,goal,phone,plan,job,job_type,disease,age,fruit,food,bad_food
            })}
            else{
              bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                  if(err) throw err;
                  newUser.password = hash;
                  newUser.save()
                  .then(user =>{
                  req.flash('success_msg','You Are Registered');
                  res.redirect('/login')
                })
                  .catch(err => 
                    res.render('index_sign_up',
                    {
                    title:'Sign up',
                    error:'Please Try Again'
                    }
                  ))
                })
              })
            }
          })
        }
      })
  }
  })
})
})



// contact
index.get('/contact',(req,res)=>{
  res.render('contact',{
    condition : true,
    title : 'Contact'
  });
})
// contact POST
index.post('/contact',(req,res)=>{
  const {title,message}= req.body;
  const newMessage = new messageDB({title,message});
  newMessage.save().then(message =>{
    res.render('contact',{
      error : 'Message Send successfully',
      condition : true,
      title : 'Contact'
    })
  }).catch(err =>{
    res.render('contact',{
      error : 'Message Not Send Please Type Something in Message or Title',
      condition : true,
      title : 'Contact'
    })
  });
})



// blogs page
index.get('/blogs',(req,res)=>{
  res.render('blogs',{
    title : 'Blogs',
    condition : true
  })
})

//plans
index.get('/plans',(req,res)=>{
  res.render('plans',{
    title :'Plans',
    condition : true
  })
}) 


// coming soon
index.get('/coming-soon',(req,res)=>{
  res.render('coming_soon',{
    title : 'Coming Soon',
    condition : true
  })
})


// admin 
index.get('/emp/Dashboard',ensureAuthenticated,(req,res)=>{
  res.render('empDash',{
      title : req.user.first_name,
      user : req.user
  })
})


// emp signup
index.get('/emp/signup',(req,res)=>{
  res.render('EmpSign',{
    title : 'Sign up',
    condition : false
  })
})


// post emp
index.post('/emp/signup',(req,res)=>{
    const {date_of_creation,first_name,last_name,password,C_password,email,phone,address,pin_code,state,education,when,specialist} = req.body;
    const newEmp = new empDB({date_of_creation,first_name,last_name,password,email,phone,address,pin_code,state,education,when,specialist});
    let errors = [];
      if(password != C_password){
      errors.push({msg : 'Password Not Matching'})
      }
      if (errors.length > 0) {
        res.render('EmpSign',{
          title : "Sign up",
          condition : false,
          errors,date_of_creation,first_name,last_name,email,phone,address,pin_code,state,education,when,specialist
        })
      }
      adminDB.findOne({email:email},(err,docs)=>{
        if(docs){res.render('EmpSign',{
          title:'Sign up',
          error:'That Email is Already Present',
          condition : false,
          date_of_creation,first_name,last_name,email,phone,address,pin_code,state,education,when,specialist
        })}
        else{
          userDB.findOne({email:email},(err,docs)=>{
            if(docs){res.render('EmpSign',{
              title:'Sign up',
              error:'That Email is Already Present',
              condition : false,
              date_of_creation,first_name,last_name,email,phone,address,pin_code,state,education,when,specialist
            })}
            else{
              empDB.findOne({email:email},(err,docs)=>{
                if(docs){res.render('EmpSign',{
                  title:'Sign up',
                  error:'That Email is Already Present',
                  condition : false,
                  date_of_creation,first_name,last_name,email,phone,address,pin_code,state,education,when,specialist
                })}
                else{
                  bcrypt.genSalt(10,(err,salt)=>{
                    bcrypt.hash(newEmp.password,salt,(err,hash)=>{
                      if(err) throw err;
                      newEmp.password = hash;
                      newEmp.save()
                      .then(user =>{req.flash('success_msg','You Are Registered');res.redirect('/login')})
                      .catch(err => res.render('EmpSign',{title:'Admin',error:'Please Try Again'}))
                    })
                  })
                }
              })
            }
          })
        }
       })
})


// admin dashboard
index.get('/admin/dashboard',ensureAuthenticated,(req,res)=>{
  userDB.countDocuments({},(err,total_user)=>{
   empDB.countDocuments({},(err,total_emp)=>{
    messageDB.countDocuments({},(err,total_message)=>{
      userDB.find({},(err,all_user)=>{
       empDB.find({},(err,all_emp)=>{
         messageDB.find({},(err,all_msg)=>{
          res.render('Admin',{
            title : 'Admin',
            user : req.user,
            total_user : total_user,
            total_emp : total_emp,
            total_message : total_message,
            all_user : all_user,
            all_emp : all_emp,
            all_msg : all_msg
          })
         })
       })
      })
    })
   })
  })
  
})

// crate admin
index.get('/crate/admin/u/privelage/9887521-21241kiLLosvswKNNo88naoNAoado23jj881no-12t-rem-asf902em-asdf-berable-2940-22-as001ndas0-3ad-adsfrhasdloamman/private/log',(req,res)=>{
  res.render('adminReg',{
    title : "Admin"
  })
})

// post request
index.post('/admin-add',(req,res)=>{
  const {name,password,email,date_of_creation,C_password} = req.body;
  const newAdmin = new adminDB({name,password,email,date_of_creation});
  let errors = [];
  if(password != C_password){
  errors.push({msg : 'Password Not Matching'})
  }
  if (errors.length > 0) {
    res.render('adminReg',{
      title : "Admin",
      errors,date_of_creation,name,email
    })
  }
  adminDB.findOne({email:email},(err,docs)=>{
   if(docs){res.render('adminReg',{title:'Admin',error:'That Email is Already Present',name,date_of_creation})}
   else{
     userDB.findOne({email:email},(err,docs)=>{
       if(docs){res.render('adminReg',{title:'Admin',error:'That Email is Already Present',name,date_of_creation})}
       else{
         empDB.findOne({email:email},(err,docs)=>{
           if(docs){res.render('adminReg',{title:'Admin',error:'That Email is Already Present',name,date_of_creation})}
           else{
             bcrypt.genSalt(10,(err,salt)=>{
               bcrypt.hash(newAdmin.password,salt,(err,hash)=>{
                 if(err) throw err;
                 newAdmin.password = hash;
                 newAdmin.save()
                 .then(user =>{req.flash('success_msg','You Are Registered');res.redirect('/login')})
                 .catch(err => res.render('adminReg',{title:'Admin',error:'Please Try Again'}))
               })
             })
           }
         })
       }
     })
   }
  })
})


// expire plan
index.get('/update-plan',ensureAuthenticated,(req,res)=>{
  res.render('update_plan',{
    title : 'Pay'
  })
})


// alert highly sansetive route
index.get('/settings',ensureAuthenticated,(req,res)=>{
  res.render('setting',{
    title : req.user.first_name,
    user : req.user
  })
})

index.get('/disable',ensureAuthenticated,(req,res)=>{
  const id = req.user._id;
  userDB.updateOne({_id:id},
    {
        $set : {disable : true}
    })
    .exec()
    .then(result =>{res.redirect('/logout')})  
})

index.get('/setting',ensureAuthenticated,(req,res)=>{
  res.render('Enable',{
    title : 'Disable',
    user : req.user
  })
})

index.get('/enable',ensureAuthenticated,(req,res)=>{
  const id = req.user._id;
  userDB.updateOne({_id:id},
    {
        $set : {disable : false}
    })
    .exec()
    .then(result =>{res.redirect('/dashboard')})  
})


module.exports = index;
