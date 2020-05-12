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
Axios.defaults.basePath = 'http://192.168.1.4:9009/admin';
//请求拦截器
Axios.interceptors.request.use((config) => {
    config.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODkyODM5OTksInN1YiI6ImFkbWluIiwiY3JlYXRlZCI6MTU4OTI3Njc5OTE3N30.ylQskIKBQcuztZ-VSitJUttQ6Dtg8mvvph4YIeBZKrms3Be9E-S3nOsPqDl464R2TjD-BkIiZ0-0KWvaBH9HSg' || '';
    return config;
}, (err) => {
    // Message.error('请求失败');
    return Promise.reject(err);
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

