const path = require('path')
const Koa = require('koa')
const consola = require('consola')
const serve = require('koa-static')
const session = require('koa-session')
const redisStore = require('koa-redis')
const bodyParser = require('koa-body')
const { Nuxt, Builder } = require('nuxt')
const app = new Koa()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const fetch = require('./middleware/node-fetch')
const { restify } = require('./middleware/restify')

config.dev = app.env !== 'production'

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.keys = ['some secret hurr'];
 
  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false) */
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
    store: redisStore({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: +process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      prefix: process.env.REDIS_PREFIX || '__RealSure-site__',
    }),
  };

  app.use(serve(path.join(__dirname, '../static')))

  app.use(session(CONFIG, app));

  app.use(bodyParser());
  
  // app.use(ctx => {
  //   // ignore favicon
  //   if (ctx.path === '/favicon.ico') return;
   
  //   let n = ctx.session.views || 0;
  //   ctx.session.views = ++n;
  //   ctx.body = n + ' views';
  // });

  app.use(restify())
  app.use(fetch())

  const { createRouter } = require('./router')
  const router = createRouter()
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
