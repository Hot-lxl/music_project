// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import app from './App'
// 引入路由
import router from './router'
// 引入vuex
import store from '@/store'
// 引入轮播图插件vue-awesome-swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'




// swiper样式
import "swiper/dist/css/swiper.css";
// 引入iconfont图标
import '@/assets/style/iconfont.css'
import "@/assets/style/reset.css"
import "@/assets/style/font-awesome/css/font-awesome.min.css"
// 动画库
import "animate.css"
// 注册插件
Vue.use(VueAwesomeSwiper);

// 关闭提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,//路由
  store,//vuex
  render: h => h(app)
})
