import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import {messages} from './components/common/i18n';
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import $ from 'jquery'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/theme-green/index.css'; // 浅绿色主题
import 'element-ui/lib/theme-chalk/index.css';// css齐全
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
// request.js
import request from "./axios/request";
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import moment from 'moment'
import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer'
// process.env.NODE_ENV==='development' && require('../mock');
// Vue.use($)
Vue.use(BootstrapVue)
Vue.use(Viewer)
Vue.use(VueVideoPlayer)
Vue.prototype.$imgurl = function(){
    if(process.env.NODE_ENV=="development" || location.origin.indexOf('uat')!=-1){
        return 'https://uatbbimage.xsztn.cn/';
    }else{
        return 'https://images.xszam.com/';
    }
};
Vue.prototype.$upfileUrl = function(url){
    if(url==undefined){
        url = '/common/saveimage';
    }
    if(process.env.NODE_ENV=="development"){
        return '/api'+url;
    }else{
        return url;
    }
};
window.localStorage.setItem('t_k_1130_h5-@&1265','NDY0MV81XzJfMjAyMDAxMTIxMDAxNTlfMQ==')
Vue.prototype.req = request;
Vue.prototype.$moment = moment;
Vue.config.productionTip = false;
Vue.use(VueI18n);

Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
axios.defaults.withCredentials = true;

//  全局过滤器 时间戳 
Vue.filter('dateformat', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
    if(dataStr){
        return moment(dataStr).format(pattern)
    }else{
        return '';
    }

})
Vue.filter('avatar',function(avatar,url){
    if(!url){
        if(process.env.NODE_ENV=="development" || location.origin.indexOf('uat')!=-1){
            url='https://uatbbimage.xsztn.cn/';
        }else{
            url = 'https://images.xszam.com/';
        }
    }
    if(avatar && avatar.indexOf('http')==-1){
        return url+avatar;
    }else{
        return avatar;
    }
})
const i18n = new VueI18n({
    locale: 'zh',
    messages
})

// //使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// })

// 路由守卫
router.beforeEach((to, from, next) => {
    // 获取浏览器token
    const token = window.localStorage.getItem('t_k_1130_h5-@&1265')
    const shopid = window.localStorage.getItem('shopid')

    // 如果没有token
    if (!(token)) {
        // 如果去的是登录
        if (to.path === '/login') {
            next(); // 放行
        } else if (to.path === '/register') {
            next(); // 放行

        } else if (to.path === '/retrievepassword') {
            next(); // 放行

        } else {
            // 否则 跳转到登录
            next({
                path: '/login'
            })
        }
    }else{
        next(); // 放行
    }
})
new Vue({
    router,
    i18n,
    render: h => h(App),
    http: {
        root: '/',
    }
}).$mount('#app')