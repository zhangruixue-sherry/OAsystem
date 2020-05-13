import Vue from 'vue'
import Router from 'vue-router'
import login from "@/views/login";
import list from "@/views/member/list";
import add from "@/views/member/add";
import sysOrg_liat from "@/views/sysOrg/index";

Vue.use(Router)

const VueRouterPush = Router.prototype.push 
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}


const router = new Router({
  mode: 'history',
  routes: [
      {
          path: '/',
          name: 'login',
          component: login,
          meta: {
              keepAlive: false
          }
      },
      {
          path: '/login',
          name: 'login',
          component: login,
          meta: {
              keepAlive: false
          }
      },
    {
      path: '/member/list',
      name: '人员列表',
      component: list,
        meta: {
            keepAlive: true
        }
    },
    {
      path: '/member/add',
      name: 'add',
      component: add,
        meta: {
            keepAlive: true
        }
    },
    {
      path: '/sysOrg/index',
      name: '组织机构',
      component: sysOrg_liat,
        meta: {
            keepAlive: true
        }
    },

  ]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = sessionStorage.getItem('Authorization');
        if (!token) {
            next('/login');
        } else {
            next();
        }
    }
});
export default router;
