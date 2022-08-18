import Vue from 'vue'
import Router from 'vue-router'
import FlowDesign from '../views/flow-design'
import UserLogin from '../views/user-login'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'UserLogin',
      component: UserLogin
    },
    {
      path: '/flow-design',
      name: 'FlowDesign',
      component: FlowDesign
    }
  ]
})
