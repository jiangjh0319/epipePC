// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "./store/store.js"; //vuex

import "./assets/iconfont"; //字体图标库
import "./style/reset.styl";
import "./js/filter"; //过滤器

import * as qiniu from 'qiniu-js'

Vue.use(qiniu)

import Util from "./js/Util";
Vue.prototype.Util = Util;

import Service from "./js/Service";
Vue.prototype.Service = Service;

import Msg from "./js/msgutil";
Vue.prototype.Msg = Msg;

Vue.prototype.Msg.init();

// import "./js/rem";
import "./js/http"; //axios请求配置

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

axios.interceptors.response.use(data => {// 如果code是10  就是token过期了
  if (data.data.h.code == 10) {
    // window.location.href = "epipe://?&mark=login_out"
  }
  return data
}, error => {
  return Promise.reject(error)
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
