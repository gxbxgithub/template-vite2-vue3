import { createStore } from 'vuex'
import home from './home.store'
import setting from './setting.store'
import article from './article.store'

const store = createStore({
  state: () => ({}),
  modules: {
    home,
    setting,
    article
  }
})

export default store