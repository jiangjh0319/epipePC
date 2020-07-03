import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const Work = r => require.ensure([], () => r(require('@/page/work/work.vue')), 'group-work')
const WorkNotice = r => require.ensure([], () => r(require('@/page/work/work_notice.vue')), 'group-work')

//workReport
const DayNews = r => require.ensure([], () => r(require('@/page/work_report/daynews.vue')), 'group-work')
const WeekNews = r => require.ensure([], () => r(require('@/page/work_report/weeknews.vue')), 'group-work')
const MonthNews = r => require.ensure([], () => r(require('@/page/work_report/monthnews.vue')), 'group-work')
const WorkReport = r => require.ensure([], () => r(require('@/page/work_report/workReport.vue')), 'group-work')


//oa ===============================
const Leave = r => require.ensure([], () => r(require('@/page/oa/leave.vue')), 'group-oa')
const Letter = r => require.ensure([], () => r(require('@/page/oa/letter.vue')), 'group-oa')
const Contract = r => require.ensure([], () => r(require('@/page/oa/contract.vue')), 'group-oa')
const Stamp = r => require.ensure([], () => r(require('@/page/oa/stamp.vue')), 'group-oa')
const Absence = r => require.ensure([], () => r(require('@/page/oa/absence.vue')), 'group-oa')
const OverTime = r => require.ensure([], () => r(require('@/page/oa/overTime.vue')), 'group-oa')
const Meal = r => require.ensure([], () => r(require('@/page/oa/meal.vue')), 'group-oa')
const Pay = r => require.ensure([], () => r(require('@/page/oa/pay.vue')), 'group-oa')
const iframeSize = r => require.ensure([], () => r(require('@/page/oa/iframeSize.vue')), 'group-oa')
const Trip = r => require.ensure([],() => r(require('@/page/oa/trip.vue')), 'group-oa') //出差
const BeAwayApply = r => require.ensure([],() => r(require('@/page/oa/beAwayApply.vue')), 'group-oa') //公出申请
const UseCar = r => require.ensure([],() => r(require('@/page/oa/useCar.vue')), 'group-oa') //用车
const Recipients = r => require.ensure([],() => r(require('@/page/oa/recipients.vue')), 'group-oa') //物品领用
const Buy = r => require.ensure([],() => r(require('@/page/oa/buy.vue')), 'group-oa') //采购
const Dimission = r => require.ensure([],() => r(require('@/page/oa/dimission.vue')), 'group-oa') //离职
const Reception = r => require.ensure([],() => r(require('@/page/oa/reception.vue')), 'group-oa') //公务接待
const Menu = r => require.ensure([], () => r(require('@/page/oa/menu.vue')), 'group-oa')//菜单
const Employee = r => require.ensure([], () => r(require('@/page/oa/employee.vue')), 'group-oa')//人员需求
const Project = r => require.ensure([], () => r(require('@/page/oa/project.vue')), 'group-oa')//项目立项
const Regular = r => require.ensure([], () => r(require('@/page/oa/regular.vue')), 'group-oa')//转正
const Document = r => require.ensure([], () => r(require('@/page/oa/document.vue')), 'group-oa')//行文呈批
const Position = r => require.ensure([], () => r(require('@/page/oa/position.vue')), 'group-oa')//调岗
const Borrow = r => require.ensure([], () => r(require('@/page/oa/borrow.vue')), 'group-oa')//借款
const ErpPermission = r => require.ensure([], () => r(require('@/page/oa/erpPermission.vue')), 'group-oa')//erp权限异动
const Reimburse = r => require.ensure([], () => r(require('@/page/oa/reimburse.vue')), 'group-oa')//报销
const ArchAplly = r => require.ensure([], () => r(require('@/page/oa/archAplly.vue')), 'group-oa')//档案借阅
const ArchTurnOver = r => require.ensure([], () => r(require('@/page/oa/archTurnOver.vue')), 'group-oa')//档案移交


const Test = r => require.ensure([], () => r(require('@/page/oa/test.vue')), 'group-oa')//报销

//oa_other ===============================
const FinishAffairs = r => require.ensure([], () => r(require('@/page/oa_other/finish_affairs.vue')), 'group-oa')
const UnFinishAffairs = r => require.ensure([], () => r(require('@/page/oa_other/unfinish_affairs.vue')), 'group-oa')
const MyApply = r => require.ensure([], () => r(require('@/page/oa_other/my_apply.vue')), 'group-oa')
const MyCopy = r => require.ensure([], () => r(require('@/page/oa_other/my_copy.vue')), 'group-oa')

//file ===========================
const AllFile = r => require.ensure([], () => r(require('@/page/file/allFile.vue')), 'group-work')
const RecentlyFile = r => require.ensure([], () => r(require('@/page/file/recentlyFile.vue')), 'group-work')


export default new Router({
  routes: [
    {
      path: '/',
      name: 'work',
      component: Work,
    },
    {
      path: '/work_notice',
      name: 'work_notice',
      component: WorkNotice,
      meta: {
        title: '工作通知'
      }
    },
    {
      path: '/leave',
      name: 'Leave',
      component: Leave,
      meta: {
        title: '请假'
      }
    },
    {
      path: '/trip',
      name: 'trip',
      component: Trip,
      meta: {
        title: '出差'
      }
    },
    {
      path: '/pay',
      name: 'pay',
      component: Pay,
      meta: {
        title: '付款'
      }
    },
    {
      path: '/beAwayApply',
      name: 'beAwayApply',
      component: BeAwayApply,
      meta: {
        title: '公出申请'
      }
    },
    {
      path: '/archAplly',
      name: 'archAplly',
      component: ArchAplly,
      meta: {
        title: '档案借阅'
      }
    },
    {
      path: '/archTurnOver',
      name: 'archTurnOver',
      component: ArchTurnOver,
      meta: {
        title: '档案借阅'
      }
    },
    {
      path: '/letter',
      name: 'Letter',
      component: Letter,
      meta: {
        title: '请示函'
      }
    },
    {
      path: '/stamp',
      name: 'Stamp',
      component: Stamp,
      meta: {
        title: '用印'
      }
    },
    {
      path: '/contract',
      name: 'Contract',
      component: Contract,
      meta: {
        title: '合同'
      }
    },
    {
      path: '/absence',
      name: 'Absence',
      component: Absence,
      meta: {
        title: '补卡'
      }
    },
    {
      path: '/overtime',
      name: 'OverTime',
      component: OverTime,
      meta: {
        title: '加班'
      }
    },
     {
      path: '/meal',
      name: 'meal',
      component: Meal,
      meta: {
        title: '就餐'
      }
    },
    {
      path: '/iframeSize',
      name: 'iframeSize',
      component: iframeSize,
      meta: {
        title: ''
      }
    },
    {
      path: '/finishaffairs',
      name: 'FinishAffairs',
      component: FinishAffairs,
      meta: {
        title: '已办事宜'
      }
    },
    {
      path: '/unfinishaffairs',
      name: 'UnFinishAffairs',
      component: UnFinishAffairs,
      meta: {
        title: '待办事宜'
      }
    },
    {
      path: '/myApply',
      name: 'MyApply',
      component: MyApply,
      meta: {
        title: '我的申请'
      }
    },
    {
      path: '/myCopy',
      name: 'MyCopy',
      component: MyCopy,
      meta: {
        title: '我的抄送'
      }
    },
    {
      path: '/daynews',
      component: DayNews,
      meta: {
        title: '日报'
      }
    },
    {
      path: '/weeknews',
      component: WeekNews,
      meta: {
        title: '周报'
      }
    },
    {
      path: '/monthnews',
      component:MonthNews,
      meta: {
        title: '月报'
      }
    },
    {
      path: '/workReport',
      component:WorkReport,
      meta: {
        title: '工作汇报'
      }
    },
    {
      path: '/allFile',
      component:AllFile,
      meta: {
        title: '全部文件'
      }
    },
    {
      path: '/recentlyFile',
      component:RecentlyFile,
      meta: {
        title: '最近文件'
      }
    },
    {
      path: '/useCar',
      component:UseCar,
      meta: {
        title: '用车'
      }
    },
    {
      path: '/recipients',
      component:Recipients,
      meta: {
        title: '物品领用'
      }
    },
    {
      path: '/buy',
      component:Buy,
      meta: {
        title: '采购'
      }
    },
    {
      path: '/dimission',
      component:Dimission,
      meta: {
        title: '离职'
      }
    },
    {
      path: '/reception',
      component:Reception,
      meta: {
        title: '公务接待'
      }
    },
    {
      path:'/menu', //菜单
      component:Menu,
    },
    {
      path:'/employee', //人员需求
      component:Employee,
      meta: {
        title: '人员需求'
      }
    },
    {
      path:'/project', //项目立项
      component:Project,
      meta: {
        title: '项目立项'
      }
    },
    {
      path:'/regular', //转正
      component:Regular,
      meta: {
        title: '员工转正'
      }
    },
    {
      path:'/document', //行文呈批
      component:Document,
      meta: {
        title: '行文呈批'
      }
    },
    {
      path:'/position', //调岗
      component:Position,
      meta: {
        title: '调岗'
      }
    },
    {
      path:'/borrow', 
      component:Borrow,
      meta: {
        title: '借款'
      }
    },
    {
      path:'/erpPermission', 
      component:ErpPermission,
      meta: {
        title: 'erp权限异动'
      }
    },
    {
      path:'/reimburse', 
      component:Reimburse,
      meta: {
        title: '报销'
      }
    },
    {
      path:'/test', 
      component:Test,
      meta: {
        title: '测试'
      }
    },
  ]
})
