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

// import "./js/rem";
import "./js/http"; //axios请求配置

Vue.config.productionTip = false

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)


import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
