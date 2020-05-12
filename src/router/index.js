import Vue from 'vue'
import Router from 'vue-router'
import list from "@/views/member/list";
import add from "@/views/member/add";
import sysOrg_liat from "@/views/sysOrg/index";

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
      name: '人员列表',
      component: list,
    },
    {
      path: '/member/add',
      name: 'add',
      component: add,
    },
    {
      path: '/sysOrg/index',
      name: '机构列表',
      component: sysOrg_liat,
    },

  ]
})