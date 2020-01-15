var express = require('express');
var router = express.Router();


/* GET ages listing. */
router.get('/ages', function(req, res, next) {
  req.db.from('offences').distinct("age")
    .then((rows) => {
      const agesData = rows.map(a => a.age);
      res.json({"ages" : agesData}) })
    .catch((err) => {
      console.log(err);
    res.json({"Error" : true, "Message" : "Error in MySQL query"}) })
});


module.exports = router;
