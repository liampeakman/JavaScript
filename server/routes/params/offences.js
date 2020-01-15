var express = require('express');
var router = express.Router();


/*  GET offences listing. */

router.get('/offences', function(req, res, next) {
  req.db.from('offence_columns').select("pretty")
    .then((rows) => {
      const offencesData = rows.map(a => a.pretty);
      res.json({"offences" : offencesData}) })
    .catch((err) => {
      console.log(err);
      // res.json({"Error" : true, "Message" : "Error in MySQL query"}) 
    })
});

module.exports = router;
