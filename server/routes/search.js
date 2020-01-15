var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// Verify token

function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken; 
      next(); 
  }else {
      res.sendStatus(403); 
  }
}



router.get('/search', verifyToken, (req, res, next) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {

    if(err) {
      res.sendStatus(401);
    } else {

      const offenceID = req.query.offence.replace(/\/|\s|[()]|[.]|[&]|[-]/g, "");
      const areaID = req.query.area;
      const ageID = req.query.age;
      const genderID = req.query.gender;
      const yearID = req.query.year;
      const monthID = req.query.month;


      const getFilteredItems = function(queryBuilder) {
        if (areaID) { 
          var splitValues = areaID.split(",");
          queryBuilder.where('o.area', splitValues[0]);
          for(var i = 1; i < splitValues.length-1; i++) {
            queryBuilder.orWhere('o.area', splitValues[i]);
          }
        }
        if (ageID) {
          var splitValues = ageID.split(",");
          queryBuilder.where('o.age', splitValues[0]);
          for(var i = 1; i < splitValues.length-1; i++) {
            queryBuilder.orWhere('o.age', splitValues[i]);
          }
        }
        if (genderID) {
          var splitValues = genderID.split(",");
          queryBuilder.where('o.gender', splitValues[0]);
          for(var i = 1; i < splitValues.length-1; i++) {
            queryBuilder.orWhere('o.gender', splitValues[i]);
          }
        }
        if (yearID) {
          var splitValues = yearID.split(",");
          queryBuilder.where('o.year', splitValues[0]);
          for(var i = 1; i < splitValues.length-1; i++) {
            queryBuilder.orWhere('o.year', splitValues[i]);
          }
        }
        if (monthID) {  
          var splitValues = monthID.split(",");
          queryBuilder.where('o.month', splitValues[0]);
          for(var i = 1; i < splitValues.length-1; i++) {
            queryBuilder.orWhere('o.month', splitValues[i]);
          }
        }
      }

      req.db.select('o.area').sum(''+offenceID+' as total').select('lat','lng').from('offences as o').join('areas as a', function () { 
        this
          .on('a.area', '=', 'o.area')}).modify(getFilteredItems).groupBy('area', 'lat','lng')

        .then((result) => {
          console.log(req.url)
          console.log(result)

          var jsonString = JSON.stringify(result) //change to string
          var resplaced = jsonString.replace(/area/g, 'LGA') //replace area with LGA
          var jsonObject = JSON.parse(resplaced); //parse back to json 

          res.json({"result" : jsonObject}) 
        })

        .catch((err) => {
          res.status(400);
        res.json({"Error" : true, "Message" : "Error in MySQL query"}) })
        }
    })
})


module.exports = router;


