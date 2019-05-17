/**
 * Created by ZWH on 2017/9/4.
 */
import Vue from "vue";
Vue.config.productionTip = false; //生产模式
Vue.config.silent = true; //去除警告


Vue.filter("slice3", function (value) {  //时间截取后三位 （秒）
  return value.slice(0,-3)
});

Vue.filter("timeSlice9", function (value) {  //时间截取后三位 （秒）
  return value.slice(0,-9)
});