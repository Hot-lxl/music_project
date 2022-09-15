import Vue from "vue";
// 引入vue-router
import VueRouter from 'vue-router';
// 引入路由配置文件
import routers from "./routers";
// 注册插件
Vue.use(VueRouter)

// 创建一个router实例对象
const router = new VueRouter({
    // 路由配置
    routes: routers
})
// 对外暴露
export default router 