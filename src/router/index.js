import Vue from 'vue'
import Router from 'vue-router'
import index from "@/views/index.vue";
import list from "@/views/member/list";
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'indez',
      component: index
    },
    {
      path: '/member',
      name: 'list',
      component: list
    },
    
  ]
})