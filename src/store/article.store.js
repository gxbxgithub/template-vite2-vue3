import { service, serviceLoading } from '../network/request'

const state = () => ({
  types: []
})

const mutations = {
  SetTypesList(state, list) {
    state.types = list
  }
}

const actions = {
  async getTypesList({state, commit}, reload) {
    if (!reload && state.types && state.types.length > 0) return
    const result = await service.get('/type/list')
    if (!result) return
    commit('SetTypesList', result.data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}