// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 使用babel-polyfill进行转码，比如 Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象
import "babel-polyfill" 
import Vue from 'vue'
import app from './App'
// 引入路由
import router from './router'
// 引入vuex
import store from '@/store'
// 引入轮播图插件vue-awesome-swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
// 引入所有api
import * as API from '@/network/api'
//fastclick 
import  FastClick  from 'fastclick'

// swiper样式
import "swiper/dist/css/swiper.css";
// 引入iconfont图标
import '@/assets/style/iconfont.css'
import "@/assets/style/reset.css"
import "@/assets/style/font-awesome/css/font-awesome.min.css"
// 动画库
import "animate.css"

//<!-- 解决点击响应延时 0.3s 问题 -->
FastClick.attach(document.body)

// 注册插件
Vue.use(VueAwesomeSwiper);

// 关闭提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,//路由
  store,//vuex
  render: h => h(app),
  beforeCreate() {
    // 注册到vue原型上这样所有组件都拥有了
    Vue.prototype.$API = API;
  }
})

