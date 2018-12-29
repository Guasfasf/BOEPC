import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { authInfo } from '@/api/login'
const whiteList = ['/login', '/forgetPassword'] // 不重定向白名单
// const _import = require('./router/_import_' + process.env.NODE_ENV)// 获取组件的方法
// Layout 是架构组件，不在后台返回，在文件里单独引入
import Layout from '@/views/layout/Layout'
import BlankLayout from '@/views/layout'
// import userList from '@/views/users/person/list'
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetRoleList').then(res => { // 拉取用户信息
          authInfo().then(res => {
            var fmtRoutes = formatRoutes(res.data.modulePcList)
            router.addRoutes(fmtRoutes)
            global.antRouter = fmtRoutes
          })
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // console.log(to)
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
let total = 0
function formatRoutes(routes) {
  const fmRoutes = []
  routes.forEach(router => {
    var {
      path,
      component,
      name,
      meta,
      children,
      redirect
    } = router
    if (children && children instanceof Array && children.length > 0) {
      total = total + 1
      children = formatRoutes(children)
    }
    if (component === 'Layout') {
      const fmRouter = {
        path: path,
        component: Layout,
        name: name,
        meta: meta,
        children: children,
        redirect: path + '/' + children[0].path
      }
      total = 0
      fmRoutes.push(fmRouter)
    } else if (component === 'BlankLayout') {
      const fmRouter = {
        path: path,
        component: BlankLayout,
        name: name,
        meta: meta,
        children: children,
        redirect: redirect
      }
      fmRoutes.push(fmRouter)
    } else {
      // if (!component) {
      //   alert(path)
      // }
      // console.log(component)
      // debugger
      // const fmRouter = {
      //   path: path,
      //   component: () => import(`./views/${component}`),
      //   name: name,
      //   hidden: true
      // }
      // fmRoutes.push(fmRouter)
      if (total > 1) {
        const fmRouter = {
          path: path,
          component: () => import(`./views/${component}`),
          // name: name
          meta: meta,
          hidden: true
        }
        fmRoutes.push(fmRouter)
      } else {
        const fmRouter = {
          path: path,
          component: () => import(`./views/${component}`),
          // name: name
          meta: meta
        }
        fmRoutes.push(fmRouter)
      }
    }
  })
  // console.log(fmRoutes, '最终')
  // debugger
  return fmRoutes
}
router.afterEach(() => {
  NProgress.done() // 结束Progress
})
