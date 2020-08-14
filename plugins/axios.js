// import { Message } from 'element-ui'
// import MESSAGE_CONST from '@/config/locales/message.en.yml'

const API_PREFIX = `/${process.env.APP__API_PREFIX || 'api'}`
// const ERROR_CODE = {
//   MODEL_VERIFICATION: -4000 // model Verification Error
// }

export default function({ $axios, error, route, store, redirect }) {
  let ErrorMessage = {
    alert: true
  }
  $axios.onRequest((config) => {
    const { alert = true, cache = false } = config
    config.url = `${API_PREFIX}/${config.url}`
    if (config.method === 'get' && !cache) {
      config.params = {
        ...(config.params || {}),
        t: Date.now()
      }
    }
    ErrorMessage = {
      ...ErrorMessage,
      alert
    }
    return config
  })

  // $axios.onResponse(res => {
  // })

  // $axios.onRequestError(err => {
  // })

  // $axios.onResponseError(err => {
  // })

  //   $axios.onError((err) => {
  //     return errorHandler(err)
  //   })

  //   const errorHandler = ({ response = {} } = {}) => {
  //     const { status = 0, data = {} } = response || {}
  //     const apiError = perfMessage(data)
  //     if (+status >= 500 || +status === 404) {
  //       error(apiError)
  //     } else if (+status === 401) {
  //       alertMessage(perfMessage({ code: status }))
  //       return store
  //         .dispatch('user/logout')
  //         .then(() => {
  //           const [meta] = route.meta || []
  //           const { redirectBack = false } = meta || {}
  //           redirectBack
  //             ? redirect({
  //                 name: 'user-login',
  //                 query: { redirect: route.fullPath }
  //               })
  //             : redirect({ name: 'user-login' })
  //         })
  //         .catch(void 0)
  //     } else if (+apiError.code === ERROR_CODE.MODEL_VERIFICATION) {
  //       store.commit('API_ERRORS', apiError)
  //       store.commit('API_MODEL_ERRORS', apiError.errors || {})
  //     }
  //     alertMessage(apiError)
  //     return Promise.reject(apiError).catch(void 0)
  //   }

  //   const perfMessage = ({ code = 500, message = '', errors = [] }) => {
  //     message = `${MESSAGE_CONST.ERROR[`E${code}`] ||
  //       message ||
  //       MESSAGE_CONST.DEFAULT}`
  //     return { code, message, errors }
  //   }

  //   const alertMessage = ({ code, message }) => {
  //     if (!ErrorMessage.alert) return
  //     Message.error({
  //       message: `E${code} - ${message}`,
  //       showClose: true,
  //       duration: 4000
  //     })
  //   }
}
