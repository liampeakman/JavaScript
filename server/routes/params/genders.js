var express = require('express');
var router = express.Router();


/* GET genders listing. */
router.get('/genders', function(req, res, next) {
  req.db.from('offences').distinct('gender')
    .then((rows) => {
      const gendersData = rows.map(a => a.gender);
      res.json({"genders" : gendersData}) })
    .catch((err) => {
      console.log(err);
    res.json({"Error" : true, "Message" : "Error in MySQL query"}) })
});


module.exports = router;
