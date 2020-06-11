import Vue from 'vue'
import Router from 'vue-router'
import login from "@/views/login";
import list from "@/views/member/list";
import sysOrg_list from "@/views/sysOrg/index";
import sysRole_list from "@/views/sysRole/list";
import sysPrivileges_list from "@/views/sysPrivileges/list";
import attendance_list from "@/views/attendance/index";
import attendance_detail from "@/views/attendance/detail";
import attendance_total from "@/views/attendance/total";
import attendanceWay from "@/views/attendanceWay/list";
import menu_list from "@/views/menu/list";
import performance from "@/views/performance/list";
import performance_detail from "@/views/performance/detail";
import salaryUserRelationship from "@/views/salaryUserRelationship/list";

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
      path: '/sysOrg/index',
      name: '组织机构',
      component: sysOrg_list,
        meta: {
            keepAlive: true
        }
    },
    {
        path: '/menu/list',
        name: '菜单列表',
        component: menu_list,
          meta: {
              keepAlive: true
          }
      },
      {
        path: '/sysRole/list',
        name: '角色列表',
        component: sysRole_list,
          meta: {
              keepAlive: true
          }
      },
      {
        path: '/sysPrivileges/list',
        name: '角色权限',
        component: sysPrivileges_list,
          meta: {
              keepAlive: true
          }
      },
      {
        path: '/attendanceWay/list',
        name: '考勤规则',
        component: attendanceWay,
        meta: {
            keepAlive: true
        }
      },
      {
          path: '/attendance/list',
          name : '考勤管理',
          component: attendance_list,
          meta: {
              keepAlive: true
          }
      },
      {
        path: '/attendance/detail',
        name : '考勤管理详情',
        component: attendance_detail,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/attendance/total',
        name: '总考勤统计',
        component: attendance_total,
        meta: {
            keepAlive: true
        }  
      },
      {
        path: '/performance/list',
        name: '绩效管理',
        component: performance,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/performance/detail',
        name: '部门绩效详情',
        component: performance_detail,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/salaryUserRelationship/list',
        name: '人员薪资管理',
        component: salaryUserRelationship,
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
