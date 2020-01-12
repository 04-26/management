import axios from 'axios';
import qs from 'qs';

// 设置服务器基本路径
// axios.defaults.baseURL='https://shop.xszam.com';//正式
// axios.defaults.baseURL='https://uatbbshop.xsztn.cn'//测试;
axios.defaults.baseURL = process.env.NODE_ENV=="development"?location.origin+'/api':location.origin  //本地  ;
axios.defaults.withCredentials = true;

// 设置axios的请求拦截器（在发送所有请求之间 给请求头统一携带token）
axios.defaults.headers = {
    'X-Custom-Header': 'foobar',
    "device": "2",
    "deviceid": "1",
    "systemos": "web",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrZW4iLCJpYXQiOjE1Mzc1NTQzMDksImRhdGEiOnsidXNlcm5hbWUiOiJ4dXRvbmdiYW8iLCJpc19zdXBlcnVzZXIiOjEsImlkIjoxNywibG9naW5fdGltZSI6MTUzNzU1NDMwOX0sImV4cCI6MTUzODE1NDMwOX0.32Lys4hjjY2XRpM2r9YSmpYA798u821m_M5Tzb6wxIU",
    'Content-Type': 'application/x-www-form-urlencoded',
    "token": window.localStorage.getItem('t_k_1130_h5-@&1265'),
    "shopid": window.localStorage.getItem('shopid')
}
axios.interceptors.request.use(config => {
    const token = window.localStorage.getItem('t_k_1130_h5-@&1265');

    config.headers.authorization = `Bearer ${token}`;

    return config;
})
/* 响应拦截器 */

axios.interceptors.response.use(function(response){ // ①10010 token过期（30天）②10011 token无效
    if (response) {
        switch (response.data.sub_code) {
            case 'UNLOGIN': //与后台约定登录失效的返回码,根据实际情况处理
                localStorage.clear(); //删除用户信息
                //如果超时就处理 ，指定要跳转的页面(比如登陆页)
                Message({
                    message: 'token失效,请重新登录!',
                    type: 'warning',
                    center: true,
                    onClose: function () {
                        router.replace({
                            path: '/login',
                        })
                    }
                });
        }
    }
    return response;

}, function (error) {

    return Promise.reject(error)

})

export default {
    get(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.get(url, {
                    params
                })
                .then(response => {
                    // 成功处理
                    resolve(response.data)
                })
                .catch(err => {
                    // 失败处理
                    reject(err)
                })
        })
    },
    post(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(response => {
                    // 成功处理
                    resolve(response)
                })
                .catch(err => {
                    // 失败处理
                    reject(err)
                })
        })
    },
    postfile(url, params = {}) {
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params))
                .then(response => {
                    // 成功处理
                    resolve(response)
                })
                .catch(err => {
                    // 失败处理
                    reject(err)
                })
        })
    },
    ppost(url, params = {}) {//对象数组转换为.格式：item[0][name] ===> item[0].name
        return new Promise((resolve, reject) => {
            axios.post(url, qs.stringify(params,{allowDots:true}))
                .then(response => {
                    // 成功处理
                    resolve(response)
                })
                .catch(err => {
                    // 失败处理
                    reject(err)
                })
        })
    },
}