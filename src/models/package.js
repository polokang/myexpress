const axios = require("axios");
var cheerio = require("cheerio");

class Package {
  constructor() {}
  getData(url, params, companyName, reqType) {
    return getPackageData(url, params, reqType).then(function(response) {
      var data = handleResponseData(response.data, companyName);
      const pack = {
        data: data
      };

      return pack;
    });
  }
}

module.exports = new Package();

function getPackageData(url, params, reqType) {
  if (reqType === "post") {
    return axios.post(url, {
      params: params
    });
  }

  return axios.get(url, {
    params: params
  });
}

function handleResponseData(responseData, companyName) {
  // console.log(responseData);
  var $ = cheerio.load(responseData);
  let arr = $("td");
  var dataTemp = [];
  if (companyName === "FG") {
    arr.each(function(k, v) {
      var src = v.firstChild.firstChild.data;
      dataTemp.push(src);
    });
    return dataTemp;
  }

  if (companyName === "ARK") {
    arr = $(".m-table1 tbody tr");
    arr.each(function(k, v) {
      var time = v.next.firstChild.data;
      var state = v.next.tagName;
      console.log(state);
      dataTemp.push(time);
    });
    return dataTemp;
  }

  return responseData;
}
