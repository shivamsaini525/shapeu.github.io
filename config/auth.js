
// bring model
const userDB = require('../models/User');
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please Login First To View Account.');
    res.redirect('/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    // user dashboard
    if(req.user.type == 'user'){
        var t = new Date();
        var todayDate = t.getDate();
          if(req.user.membership <= todayDate){
            res.redirect('/update-plan')
          }
          if(req.user.disable == true){
            res.redirect('/setting')
          }else{
            res.redirect('/dashboard')
          }
    }
    // for emp
    if(req.user.type == 'emp'){
      console.log(req.user)
      res.redirect('/emp/Dashboard')
    }
    // admin dashboard
   if(req.user.type == 'admin'){
      res.redirect('/admin/dashboard')
    }  
  }
};
