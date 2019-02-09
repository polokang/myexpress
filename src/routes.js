const express = require("express");
const packageRoutes = require("./routes/package");

const router = express.Router();

var superagent = require('superagent');
var cheerio = require("cheerio");

router.get("/", (req, res) => {
  // res.send("welcome");


  superagent.post('http://www.etong.com.au/chaxun.php')
    .charset('gbk')
    .send({ numid: 'ET194982' })
    .set('Content-type', 'application/x-www-form-urlencoded')
    .end(function (err, sres) {
      var html = sres.text;
      var $ = cheerio.load(html, { decodeEntities: false });
      var ans = $('".i-left-tit"').eq(0).html();
      res.send(ans);
    });

});

router.use("/api", packageRoutes);

module.exports = router;
