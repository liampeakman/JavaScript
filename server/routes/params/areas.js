var express = require('express');
var router = express.Router();


/* GET areas listing. */
router.get('/areas', function(req, res, next) {
  req.db.from('areas').distinct('area')
    .then((rows) => {
      const areaData = rows.map(a => a.area);
      res.json({"areas" : areaData}) })
    .catch((err) => {
      console.log(err);
    res.json({"Error" : true, "Message" : "Error in MySQL query"}) })
});



module.exports = router;
