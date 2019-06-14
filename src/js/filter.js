/**
 * Created by ZWH on 2017/9/4.
 */
import Vue from "vue";
Vue.config.productionTip = false; //生产模式
Vue.config.silent = true; //去除警告


Vue.filter("slice3", function (value) {  //时间截取后三位 （秒）
  if(!value) return null
  return value.slice(0,-3)
});
Vue.filter("substr10", function (value) {  //时间截取后9位 （秒）
  if(!value) return null
  return value.substring(0,10)
});

Vue.filter('fileSize',function(value){
  value = value-0
  
    if(value<5500){
        value = value/1024
        return value.toFixed(2)+'KB';
    }
    value = value/1024/1024
    return value.toFixed(2)+'MB';
})