const axios = require("axios");
var cheerio = require("cheerio");
var FormData = require("form-data");
var qs = require("qs");
var iconv = require("iconv-lite")
var superagent = require('superagent')
require('superagent-charset')(superagent)


class Package {
  constructor() { }
  getData(url, params, companyName, reqType) {
    return getPackageData(url, params, reqType).then(function (response) {
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
  if (reqType === "post") {
    return superagent.post(url)
      .charset('gbk')
      .send(params)
      .set('buffer[mine]', 'true')
      .set('Content-type', 'application/x-www-form-urlencoded');


  }

  return axios.get(url, {
    params: params
  });
}

function handleResponseData(responseData, companyName) {
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
  let $ = cheerio.load(responseData.text);
  let dataTemp = [];
  arr = $(".i-middle1 ul table tr");
  arr.each(function (k, v) {
    if (v.childNodes.length > 3) {
      if (v.childNodes[1].name === 'td') {
        let time = v.childNodes[1].firstChild.data;
        let state = v.childNodes[5].firstChild.data;
        let info = { time: time, state: state };
        dataTemp.push(info);

      }
    }
  });

  return dataTemp.reverse();
}

function exp_ark(responseData) {
  let $ = cheerio.load(responseData.data);
  let dataTemp = [];
  arr = $(".m-table1 tr");
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
  let $ = cheerio.load(responseData.data);
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
  return dataTemp.reverse();
}
