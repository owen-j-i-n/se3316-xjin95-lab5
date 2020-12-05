//to authanticate 
module.exports = function (req, res, next) {

    req.passport && req.passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) { return next(err) }
      
        
      if(!user) req.userInfo = null;

      else req.userInfo = user
      next()
    })(req, res, next)
  }
  
