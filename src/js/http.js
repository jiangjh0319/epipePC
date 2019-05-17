/**
 * Created by JJH on 2017/9/27.
 */
import axios from "axios";
/*配置axios的默认*/
axios.defaults.withCredentials = true;
axios.defaults.timeout = 5000;

const dev = 'http://192.168.3.166:8280/member/v1'; //测试
// const dev = 'http://192.168.3.181:8280/member/v3'; // 闵文杰
const product = 'https://apps.epipe.cn/member/v1';//正式环境
axios.defaults.baseURL = window.location.href.indexOf("apps.epipe.cn")>0 ? product : dev;
 axios.defaults.baseURL = product;

function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)){
    let str = unescape(arr[2]);
    return str;
  }else{
    return null;
  }
};

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'
console.log(getCookie("auth_token"))

if (getCookie("auth_token")) {
  window.localStorage.setItem("auth_token",getCookie("auth_token"));
}

axios.interceptors.request.use(
  config => {
    if(getCookie("auth_token")){
      if(!config.headers.auth_token){
        config.headers.auth_token = getCookie("auth_token");
      }
      window.localStorage.setItem("auth_token",getCookie("auth_token"));
    }else{
      if(!config.headers.auth_token){
          // config.headers.auth_token = window.localStorage.auth_token;
          config.headers.auth_token = "d7504c6e-80f4-455a-afff-6d1f2d99bf8d"
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });
// http响应拦截器
axios.interceptors.response.use(data => {// 如果code是10  就是token过期了
  if (data.data.h.code == 10) {
    // window.location.href = "epipe://?&mark=login_out"
  }
  return data
}, error => {
  return Promise.reject(error)
})

export default axios
