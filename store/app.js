// @ts-ignore
import { APP } from '@/store/mutation/types'
// import { App } from '@/config/api.yml'
// import _reduce from 'lodash/reduce'

const state = () => ({
  cmsConfig: {}
})

const getters = {
  cmsConfig: (state) => state.cmsConfig
}

const actions = {
  getCMSConfig({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .$get('cms/config')
        .then((data) => {
          commit(APP.CMS_CONFIG, data)
          resolve(data)
        })
        .catch((err) => reject(err))
    })
  }
}

const mutations = {
  [APP.CMS_CONFIG](state, cmsConfig = {}) {
    state.cmsConfig = cmsConfig
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
