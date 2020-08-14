const Router = require('koa-router')
const { METHOD } = require('./config/api')

const router = new Router({
  prefix: `/api`
})

const careteRoute = mapping => {
  for (const url in mapping) {
    const [method, path] = url.split(' ')
    const routerMethod = (method || '').trim().toLocaleLowerCase()
    if (!METHOD[routerMethod]) {
      continue
    }
    router[routerMethod](path, mapping[url])
  }
}

const addControllers = (dir = 'controllers') => {
  const fs = require('fs')
  const files = fs.readdirSync(`${__dirname}/${dir}`)
  const jsFiles = files.filter(f => f.endsWith('.js'))

  for (const f of jsFiles) {
    const mapping = require(`${__dirname}/${dir}/${f}`)
    careteRoute(mapping)
  }
}

module.exports = {
  createRouter: (dir = 'controllers') => {
    addControllers(dir)
    return router
  }
}
