import Vue from 'vue'
import Router from 'vue-router'
import list from "@/views/member/list";
import add from "@/views/member/add";
Vue.use(Router)

const VueRouterPush = Router.prototype.push 
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/member/list',
      name: 'list',
      component: list,
    },
    {
      path: '/member/add',
      name: 'add',
      component: add,
    },


  ]
})