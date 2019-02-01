const axios = require("axios");
var cheerio = require("cheerio");
var FormData = require("form-data");
var qs = require("qs");
var iconv = require("iconv-lite")

class Package {
  constructor() { }
  getData(url, params, companyName, reqType) {
    return getPackageData(url, params, reqType).then(function (response) {
      // var data = handleResponseData(response.data, companyName);

      var tempVar = response.data.json();
      console.log(tempVar);
      // console.log(response.headers)
      var data = handleResponseData(response, companyName);
      const pack = {
        data: data
      };

      return pack;
    });
  }
}

module.exports = new Package();

function getPackageData(url, params, reqType) {
  // if (reqType === "post") {
  //   const bodyFormData = new FormData();
  //   bodyFormData.append("numid", "ET194982");
  //   return axios.post(url, {
  //     data: bodyFormData,
  //     headers: { "Content-Type": "multipart/form-data" }
  //   });
  // }

  if (reqType === "post") {
    const bodyFormData = { numid: 'ET194982' }
    const config = { headers: { 'Content-type': 'application/x-www-form-urlencoded' } };
    return axios.post("http://www.etong.com.au/chaxun.php", qs.stringify(bodyFormData), config);
  }

  return axios.get(url, {
    params: params
  });
}

function handleResponseData(responseData, companyName) {
  let v = iconv.decode(responseData.data, 'gb2312');
  if (companyName === "FG") {
    return exp_fg(responseData);
  }

  if (companyName === "ARK") {
    return exp_ark(responseData);
  }

  if (companyName === "ET") {
    return exp_et(responseData);
  }

  return responseData;
}

function exp_et(responseData) {
  var strJson = iconv.decode(responseData, 'gb2312'); // 汉字不乱码

  let $ = cheerio.load(strJson);
  let dataTemp = [];


  arr = $(".i-left-tit");
  arr.each(function (k, v) {
    let time_node = v.data;
    var sson = iconv.decode(time_node, 'gb2312'); // 汉字不乱码
    console.log(sson);
  });



  let info = { time: "", state: responseData };
  dataTemp.push(info);
  return dataTemp;
}

function exp_ark(responseData) {
  let $ = cheerio.load(responseData);
  let dataTemp = [];
  arr = $(".m-table1 > tbody > tr");
  arr.each(function (k, v) {
    let td_node = v.firstChild.next;
    if (td_node.tagName === "td") {
      if (td_node.firstChild != null) {
        let time_node = td_node.firstChild.next.firstChild;
        let time = time_node.data;
        let state_node = td_node.next.next.firstChild.firstChild;
        let info = { time: time, state: state_node.data };
        dataTemp.push(info);
      }
    }
  });
  return dataTemp.reverse();
}

function exp_fg(responseData) {
  let $ = cheerio.load(responseData);
  let arr = $("td");
  let dataTemp = [];
  let serid = 0;
  arr.each(function (k, v) {
    if (k % 2 === 0) {
      //even number
      let time = v.firstChild.firstChild.data;
      let info = { time: time, state: "" };
      dataTemp[serid] = info;
    } else {
      //odd number
      let state = v.firstChild.firstChild.data;
      dataTemp[serid].state = state;
      serid++;
    }
  });
  return dataTemp;
}
