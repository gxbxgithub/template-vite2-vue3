import { createRouter, createWebHashHistory } from 'vue-router'
import { JWT_TOKEN_KEY } from '../libs/constant'

import settingRoutes from './setting.routes'
import articleRoutes from './article.routes'

const Login = () => import('@views/home/login.vue')
const Home = () => import('@views/home/home.vue')
const NotFound = () => import('@views/home/404.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/', name: 'Home', component: Home, children: [
        ...settingRoutes,
        ...articleRoutes
      ]
    },
    { path: '/login', name: 'Login', component: Login },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem(JWT_TOKEN_KEY)
  if (to.path === '/login') return next()
  if (!token) return next({ path: '/login' })
  next()
})





// const SetMenu = () => import('@views/settings/setmenu.vue')
// const SetMenuAdd = () => import('@views/settings/setmenuadd.vue')
// const dynamicRoutes = {
//   path: '/setting_menu2', name: 'SetMenu', component: SetMenu, children: [
//     { path: '/setting_menu2/add', name: 'SetMenuAdd', component: SetMenuAdd }
//   ]
// }
// export function initDynamicRoutes() {
//   const currentRoutes = router.options.routes
//   console.log(currentRoutes);
//   currentRoutes[0].children.push(dynamicRoutes)
//   router.addRoute(currentRoutes[0])

//   console.log(router.options.routes);
// }




export default router