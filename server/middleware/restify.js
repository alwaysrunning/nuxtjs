// const { API_PREFIX } = require('../config/env')
// const consola = require('../utils/consola')

module.exports = {
  restify: () => {
    return async (ctx, next) => {
      if (ctx.path.startsWith(`/api`)) {
        ctx.rest = ([data, err] = [], { auth = '' } = {}) => {
          ctx.type = 'application/json'
          if (err) {
            // consola.error(JSON.stringify(err, null, 2))
            ctx.status = err.status
            ctx.body = err
          } else {
            // consola.success(JSON.stringify(data, null, 2), '\n\n')
            ctx.body = data
          }
        }

        try {
          await next()
        } catch (e) {
          let code = 500
          let message = e.message || e.statusText || 'Internal Server Error'
          if (e.type === 'request-timeout') {
            code = 408
            message = 'Request Timeout'
          } else {
            code = e.status || 500
          }
          ctx.type = 'application/json'
          ctx.status = code
          ctx.body = { code, message }
        }
      } else {
        await next()
      }
    }
  }
}
