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
  // let $ = cheerio.load(responseData);
  // let arr = $("td");
  // let dataTemp = [];
  if (companyName === "FG") {
    return exp_fg(responseData);
  }

  // if (companyName === "ARK") {
  //   arr = $(".m-table1 > tbody > tr");
  //   arr.removeClass;
  //   arr.each(function(k, v) {
  //     let td_node = v.firstChild.next;
  //     if (td_node.tagName === "td") {
  //       if (td_node.firstChild != null) {
  //         let time_node = td_node.firstChild.next.firstChild;
  //         let time = time_node.data;
  //         let state_node = td_node.next.next.firstChild.firstChild;
  //         console.log(time);
  //         console.log(state_node.data);
  //         dataTemp.push(time);
  //       }
  //     }
  //   });
  // return dataTemp;
  // }

  return responseData;
}

function exp_fg(responseData) {
  let $ = cheerio.load(responseData);
  let arr = $("td");
  let dataTemp = [];
  arr.each(function(k, v) {
    if (k % 2 === 0) {
      //even number
      let time = v.firstChild.firstChild.data;
      let info = { time: time, state: "" };
      if (k > 0) {
        dataTemp[k - 1] = info;
      } else {
        dataTemp[k] = info;
      }
    } else {
      //odd number
      let state = v.firstChild.firstChild.data;
      dataTemp[k - 1].state = state;
    }
  });
  return dataTemp;
}
