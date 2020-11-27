import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/index.css';
import 'font-awesome/css/font-awesome.min.css'
import md5 from 'js-md5';

Vue.use(ElementUI);
Vue.prototype.$md5 = md5;
Vue.prototype.$axios = Axios;
// Axios.defaults.basePath = 'http://192.168.1.9:9009/admin';
Axios.defaults.basePath = 'http://192.168.1.101:9009/admin';
//请求拦截器
Axios.interceptors.request.use(
    config => {
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        let token = sessionStorage.getItem('Authorization')
        if (!Object.prototype.hasOwnProperty.call('Authorization') && token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
});

//响应拦截器
Axios.interceptors.response.use((response) => {
    return response;
}, (err) => {
    // Message.error('请求失败');
    return Promise.reject(err);
});
Vue.config.productionTip = false
 new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')

