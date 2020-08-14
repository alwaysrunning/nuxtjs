const { METHOD } = require('../config/api')

module.exports = {
  [`${METHOD.get} /cms/config`]: async (ctx) => {
    let [res, err] = [[], null]
    try {
      [res, err] = await ctx.fetch('/cms/messages/:platformId', {
        method: 'GET',
        params: {
          platformId: 1
        }
      })
    } catch (e) {
      err = e
    } finally {
      if (err) {
        res = []
      }
      ctx.rest([res])
    }
  }
}
