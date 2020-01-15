var express = require('express');
var router = express.Router();


/* GET years listing. */
router.get('/years', function(req, res, next) {
  req.db.from('offences').distinct('year')
    .then((rows) => {
      const yearData = rows.map(a => a.year);
      res.json({"years" : yearData}) })
    .catch((err) => {
      console.log(err);
    res.json({"Error" : true, "Message" : "Error in MySQL query"}) })
});

module.exports = router;
