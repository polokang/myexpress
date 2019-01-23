const express = require("express");
const pack = require("../models/package");
const codeValidator = require("../middlewares/codeVaildator");
const responseFormatter = require("../utils/responseFormatter");

const router = express.Router();

router.get("", codeValidator, (req, res, next) => {
  const url = req.params.url;
  const params = req.params.requestParams;
  const companyName = req.companyName;
  const reqType = req.reqType;
  pack
    .getData(url, params, companyName, reqType)
    .then(response => responseFormatter(res, 200, null, response))
    .catch(err => next(err));
});

module.exports = router;
