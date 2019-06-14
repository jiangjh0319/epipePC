import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const Work = r => require.ensure([], () => r(require('@/page/work/work.vue')), 'group-work')
const WorkNotice = r => require.ensure([], () => r(require('@/page/work/work_notice.vue')), 'group-work')




//oa ===============================
const Leave = r => require.ensure([], () => r(require('@/page/oa/leave.vue')), 'group-oa')
const Letter = r => require.ensure([], () => r(require('@/page/oa/letter.vue')), 'group-oa')

//oa_other ===============================
const FinishAffairs = r => require.ensure([], () => r(require('@/page/oa_other/finish_affairs.vue')), 'group-oa')
const UnFinishAffairs = r => require.ensure([], () => r(require('@/page/oa_other/unfinish_affairs.vue')), 'group-oa')
const MyApply = r => require.ensure([], () => r(require('@/page/oa_other/my_apply.vue')), 'group-oa')
const MyCopy = r => require.ensure([], () => r(require('@/page/oa_other/my_copy.vue')), 'group-oa')




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
  ]
})
