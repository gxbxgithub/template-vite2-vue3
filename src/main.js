import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 全局配置对象
import { toast, Loading } from './libs/message'
import { service, serviceLoading } from './network/request'
import dayjs from 'dayjs'
// 引入通用样式
import "@/assets/style/reset.css"
import "@/assets/style/common.css"
// 全局icons
import * as ElmIcons from '@element-plus/icons-vue'
// Markdown 编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App)

// 注册全局组件
for (let iconName in ElmIcons) {
  app.component(iconName, ElmIcons[iconName])
}

// 配置全局
app.config.globalProperties.$toast = toast
app.config.globalProperties.$api = service
app.config.globalProperties.$api_loading = serviceLoading
app.config.globalProperties.$loading = Loading
app.config.globalProperties.$dayjs = dayjs

app.use(router)
app.use(store)
app.use(mavonEditor)
app.mount('#app')