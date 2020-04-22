/**
 * Created by lenovo on 2017/6/12.
 */
const Service = {
  saveLeave : '/work/leave/apply/save', //请假申请
  saveTrip:'/work/trip/save',//出差
  saveAwayApply:'/outsign/task/saves',//公出申请
  useCarApi:'/work/car/save',//用车
  recipientsApi:'/work/material/save',//物品领用
  getBuyTypeApi:'/work/buy/type',//采购类型
  getPayTypeApi:'/work/pay2/type',//支付方式
  getBuySaveApi:'work/buy/save',//采购点击保存
  getPositionType:'work/position/type',//岗位类别
  getDimissionType:'work/dimission/type',//离职类型
  getDimission:'/work/dimission/save',//离职页面点击提交按钮
  getReceptionSave:'/work/reception/save',//公务接待提交按钮
  getEmployeeSave:'/work/employee/save',//人员需求提交接口
  getProjectSave:'/work/project/save',//项目立项提交接口
  getRegularSave:'/work/regular/save',//转正提交接口
  getDocumentSave:'/work/document/save',//行文呈批提交接口

  // baseUrl:'http://192.168.3.22:8787/#/',
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
