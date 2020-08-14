import { mapGetters } from 'vuex'
import Vue from 'vue'

export default () => {
  Vue.mixin({
    computed: {
      ...mapGetters({ $cmsConfig: 'app/cmsConfig' })
    }
  })

  Vue.prototype.$cmsGet = function(_key = '') {
    return this.$cmsConfig.find((config, i) => config.messageKey === _key) || {}
  }

  Vue.prototype.$cmsGetMsg = function(_key = '') {
    return this.$cmsGet(_key).slot || ''
  }
}
