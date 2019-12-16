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
const iframeSize = r => require.ensure([], () => r(require('@/page/oa/iframeSize.vue')), 'group-oa')

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
  ]
})
