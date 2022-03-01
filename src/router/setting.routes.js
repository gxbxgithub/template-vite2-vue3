const Menus = () => import('@views/settings/menus.vue')
const EditPass = () => import('@views/settings/editpass.vue')

const routes = [
  { path: '/setting/menus', name: 'SettingMenus', component: Menus },
  { path: '/setting/editpass', name: 'EditPass', component: EditPass }
]

export default routes