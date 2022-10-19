import Vue from "vue";
// 引入vue-router
import VueRouter from 'vue-router';
// 引入路由配置文件
import routers from "./routers";
// 注册插件
Vue.use(VueRouter)
//先把VueRouter的push方法浅拷贝一份
let orginPush = VueRouter.prototype.push;
let orginReplace = VueRouter.prototype.replace;
// 重写push|replace
// 第一个参数：告诉push方法到哪里去（地址跳转）
// 第二个参数：成功回调
// 第三个参数：失败回调
// call和apply区别
// 相同点：都可以调用函数一次，可以篡改函数的上下文一次
// 不同点：call和apply传递参数的时候不同，call传递的参数用逗号隔开，apply则是传递的数组

// push
VueRouter.prototype.push = function (localhost, resolve, reject) {
    // 当有成功回调和失败回调传入的时候执行
    if (resolve && reject) {
        orginPush.call(this, localhost, resolve, reject);
    } else {
        orginPush.call(this, localhost, () => { }, () => { })
    }
}
// replace
VueRouter.prototype.replace = function (localhost, resolve, reject) {
    // 判断是否有成功回调和失败回调传入
    if (resolve && reject) {
        orginReplace.call(this, localhost, resolve, reject);
    } else {
        orginReplace.call(this, localhost, () => { }, () => { })
    }
}
// 创建一个router实例对象
const router = new VueRouter({
    // 路由配置
    routes: routers
})
// 对外暴露
export default router 