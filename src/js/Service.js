/**
 * Created by lenovo on 2017/6/12.
 */
const Service = {
  saveLeave : '/work/leave/apply/save', //请假申请

  // baseUrl:'http://192.168.3.122:8787/#/',
  baseUrl:'http://192.168.3.166/pc/#/',
  // baseUrl:'https://apps.epipe.cn/app-https/pc/1.4.0/#/',
  queryString: function (params, postFlag) {
    let paramUrl = "";
    for (let key in params) {
      if (!postFlag && paramUrl == "") {
        paramUrl += "?" + key + "=" + params[key];
      } else {
        paramUrl += "&" + key + "=" + params[key];
      }
    } 
    return paramUrl;
  },
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return unescape(arr[2]);
    else
      return null;
  }
};
module.exports = Service;
