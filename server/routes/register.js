var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');


/* POST register . */

router.post('/register', function(req, res, next) {

    console.log("create user..");
  
    console.log("Email: " + req.body.email);
    console.log("Password: " + req.body.password);
  
    req.db.raw("INSERT INTO users (email, password) VALUES ('"+req.body.email+"','"+req.body.password+"')")
        .then((result) => {
            res.status(201);
            res.json({ success: true, message: 'ok' });     // respond back to request
        })
        
        .catch((err) => {
            console.log(err);
            res.status(400);
            res.json("user has already been created");      
         })    
});

  
router.post('/login', function(req, res, next) {

    req.db.raw("SELECT * FROM users WHERE email = '"+req.body.email+"'")
        .then((result) => {
            if (result[0][0].password == req.body.password)  {
                jwt.sign({user: req.body.email}, 'secretkey', { expiresIn: '86400s' }, (err, token) => {
                    res.json({
                        token: token,
                        token_type: "Bearer",
                        expires_in: 86400
                    })
                })
              }
              else {
                res.status(401);
                res.json("invalid login - bad password")
              }
              console.log(result[0][0].password)
        })
        .catch((err) => {
            res.status(400);
            console.log(err);
            res.json("invalid login - user does not exist")
        })    
});



module.exports = router;