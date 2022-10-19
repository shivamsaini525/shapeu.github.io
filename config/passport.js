const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');
const emp = require('../models/emp');
const admin = require('../models/admin');


module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({email: email},(err,user) =>{
        if(err) throw err;
        if (!user) {
          emp.findOne({email:email},(err,user)=>{
            if(err) throw err;
            if(!user){
              admin.findOne({email:email},(err,user) =>{
                if(err) throw err;
                if(!user){
                  return done(null,false,{message:'That Email is Not Registerd with us'})
                }else{
                  bcrypt.compare(password, user.password,(err, isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                      return done(null,user);
                    }else{
                      return done(null,false,{message:'Password is not Matching'})
                    }
                  })
                }
              })
            }
            else{
              bcrypt.compare(password, user.password,(err, isMatch)=>{
                if(err) throw err;
                  if(isMatch){
                    return done(null,user);
                  } 
                  else{
                  return done(null,false,{message:'Password is not Matching'})
                  }
              })
            }
           })
          }
         if(user){
          bcrypt.compare(password, user.password, (err, isMatch) => {
           if (err) throw err;
           if (isMatch) {
             return done(null, user);
           }else {
             return done(null, false, { message: 'Password incorrect' });
           }
         })
       }
      })
  })
 );


  passport.serializeUser(function(user, done) {
    done(null, user);
  });

passport.deserializeUser(function(user,done){
  const email = user.email;
  if(user.type == 'admin'){
    admin.findOne({email:user.email},(err,user)=>{
      done(err,user);
    })
  }
  if(user.type == 'user'){
    User.findOne({email:user.email},(err,user)=>{
      done(err,user);
    })
  }
  if(user.type == 'emp'){
    emp.findOne({email:user.email},(err,user)=>{
      done(err,user);
    })
  }
})


};
