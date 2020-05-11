import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/index.css';
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI);
Vue.prototype.$axios = Axios;
Axios.defaults.basePath = 'http://39.99.175.166:9000/admin';
//请求拦截器
Axios.interceptors.request.use((config) => {
    config.headers.common['Authorization'] = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODkxOTUzMTMsInN1YiI6ImFkbWluIiwiY3JlYXRlZCI6MTU4OTE4ODExMzA3MX0.AenY78pY66FkU-B9Zy-pfoXzSbHTpZH8k3sb6w6oK31VfURSQ61VxkcWLSfLTElwM7QLMUQ0iWUu9PNxRgeSwA' || '';
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

