// 对axios二次封装
import axios from 'axios'

// 1.利用axios对象的方法create，创建一个axios实例
// 2.request就是axios，只不过需要自己配置一下
const requests = new axios.create({
    // 1.配置基础路径
    baseURL: "/api",
    // 设置超时时间
    timeout: 5000,
})
// 请求拦截器：在发送请求之前可以检测到，可以在发送之前做一些事情
requests.interceptors.request.use((config) => {
    // config:配置对象，对象里面有一个属性很重要，headers请求头
    return config;
})
// 响应拦截器：在服务器响应数据之后，可以对响应结果做一些处理
requests.interceptors.response.use((res) => {

    // 返回请求的结果
    return res.data;
}, (error) => {
    // 响应失败的回调函数：终止promise链
    return Promise.reject(new Error("嗝屁了"))
})
// 对外暴露
export default requests;

