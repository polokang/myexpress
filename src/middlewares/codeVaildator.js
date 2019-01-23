const responseFormatter = require("../utils/responseFormatter");

module.exports = (req, res, next) => {
  const num = req.query.num.toUpperCase(); //package number
  if (num.startsWith("FG")) {
    req.params.url = "http://www.fastgo.com.au/index/index/logquery";
    req.companyName = "FG";
    req.reqType = "get";
    req.params.requestParams = {
      order_sn: num,
      type: "1"
    };
    return next();
  } else if (num.startsWith("ARK")) {
    req.companyName = "ARK";
    req.reqType = "get";
    req.params.url = "http://www.arkexpress.com.au/searchOrder";
    req.params.requestParams = {
      orderNo: num
    };
    return next();
  } else if (num.startsWith("ET")) {
    req.companyName = "ET";
    req.reqType = "post";
    req.params.url = "http://www.etong.com.au/chaxun.php";
    req.params.requestParams = {
      numid: num
    };
    return next();
  }

  return responseFormatter(
    res,
    400,
    `${req.query.num} is invalid number of package.`,
    null
  );
};
