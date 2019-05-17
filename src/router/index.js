import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


const Work = r => require.ensure([], () => r(require('@/page/work/work.vue')), 'group-foo')




//oa ===============================
const Leave = r => require.ensure([], () => r(require('@/page/oa/leave.vue')), 'group-oa')

//oa_other ===============================
const FinishAffairs = r => require.ensure([], () => r(require('@/page/oa_other/finish_affairs.vue')), 'group-work')
const UnFinishAffairs = r => require.ensure([], () => r(require('@/page/oa_other/unfinish_affairs.vue')), 'group-work')
const MyApply = r => require.ensure([], () => r(require('@/page/oa_other/my_apply.vue')), 'group-work')
const MyCopy = r => require.ensure([], () => r(require('@/page/oa_other/my_copy.vue')), 'group-work')




export default new Router({
  routes: [
    {
      path: '/',
      name: 'work',
      component: Work
    },
    {
      path: '/leave',
      name: 'Leave',
      component: Leave
    },
    {
      path: '/finishaffairs',
      name: 'FinishAffairs',
      component: FinishAffairs
    },
    {
      path: '/unfinishaffairs',
      name: 'UnFinishAffairs',
      component: UnFinishAffairs
    },
    {
      path: '/myApply',
      name: 'MyApply',
      component: MyApply
    },
    {
      path: '/myCopy',
      name: 'MyCopy',
      component: MyCopy
    },
  ]
})
