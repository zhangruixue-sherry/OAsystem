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
import salary from "@/views/salary/list";
import notice from "@/views/notice/list";
import contract from "@/views/contract/list";
import documents from "@/views/documents/list";
import chapter from "@/views/chapter/list";
import approveOrder from "@/views/approveOrder/list";
import approve from "@/views/approve/list";
import sysProject from "@/views/sysProject/list";
import paymentList from "@/views/payment/list";
import procurementList from "@/views/procurement/list";
import procurement_detail from "@/views/procurement/detail";
import budget_list from "@/views/budget/list";
import budget_detail from "@/views/budget/detail";
import expense_list from "@/views/expense/list";
import expense_detail from "@/views/expense/detail";
import sysUserLog from "@/views/sysUserLog/list";
import personalDaily from "@/views/daily/personalList";
import departmentDaily from "@/views/daily/departmentList";

Vue.use(Router)

const VueRouterPush = Router.prototype.push 
Router.prototype.push = function push (to) {
    return VueRouterPush.call(this, to).catch(err => err)
}


const router = new Router({
  mode: 'hash',
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
      {
        path: '/salary/list',
        name: '薪资发放管理',
        component: salary,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/notice/list',
        name: '公告管理',
        component: notice,
        meta: {
            keepAlive: true
        }
      },
      {
          path: '/contract/list',
          name: '合同管理',
          component: contract,
          meta: {
              keepAlive: true
          }
      },
      {
        path: '/documents/list',
        name: '文档管理',
        component: documents,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/chapter/list',
        name: '用章申请管理',
        component: chapter,
        meta: {
            keepAlive: true
        }  
      },
      {
        path: '/approveOrder/list',
        name: '审批单管理',
        component: approveOrder,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/approve/list',
        name: '审批流程管理',
        component: approve,
        meta: {
            keepAlive: true
        }
      },
      {
        path: '/sysProject/list',
        name: '项目管理',
        component: sysProject,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/payment/list',
        name: '付款单管理',
        component: paymentList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/procurement/list',
        name: '采购单管理',
        component: procurementList,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/procurement/detail',
        name: '采购单详情',
        component: procurement_detail,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/budget/list',
        name: '预算单列表',
        component: budget_list,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/budget/detail',
        name: '预算单详情',
        component: budget_detail,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/expense/list',
        name: '用户报销单列表',
        component: expense_list,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/expense/detail',
        name: '用户报销单详情',
        component: expense_detail,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/sysUserLog/list',
        name: '系统日志管理',
        component: sysUserLog,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/daily/personalList',
        name: '个人日报',
        component: personalDaily,
        meta: {
          keepAlive: true
        }
      },
      {
        path: '/daily/departmentList',
        name: '部门日报',
        component: departmentDaily,
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
