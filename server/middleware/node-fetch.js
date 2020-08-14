const qs = require('qs')
const fetch = require('node-fetch')
const Bluebird = require('bluebird')
const { forEach, replace } = require('lodash')
// const consola = require('../utils/consola')
// const { logError2CloudWatch } = require('../utils/logger')
// const {
//   API_URL_BACKEND,
//   GOOGLE_MAP_API_URL,
//   API_REQUEST_TIMEOUT_LIMIT
// } = require('../config/env')

fetch.Promise = Bluebird

module.exports = () => {
  const setBody = ({ data = null, type = 'json' } = {}) => {
    if (data) {
      switch (type) {
        case 'form-data':
          return { body: data }
        case 'x-www-form-urlencoded':
          return { form: data }
        default:
          return { body: JSON.stringify(data) }
      }
    }
    return {}
  }

  const setHeader = ({
    headers = {},
    method = 'GET',
    type = 'json',
    auth = null
  } = {}) => {
    let authorization = {}
    if (auth) {
      const { token, tokenType } = auth
      authorization = { Authorization: `${tokenType} ${token}` }
    }
    const TYPES = {
      'text/plain': 'text/plain',
      'form-data': headers['content-type']
    }
    const contentType = ['GET', 'DELETE'].includes(method)
      ? {}
      : {
          'Content-Type': `${TYPES[type] ||
            `application/${type};charset=UTF-8`}`
        }
    return {
      'cache-control': 'no-cache',
      ...authorization,
      ...contentType
    }
  }

  const setPath = ({ host = '', path = '', params = {}, query = {} } = {}) => {
    query = `${qs.stringify(query, { encode: true })}`
    forEach(params, (v, k) => (path = replace(path, `\/\:${k}`, `\/${v}`)))
    return query ? `${host}${path}?${query}` : `${host}${path}`
  }

  const defaultOpts = {
    method: 'GET',
    headers: {}, // request headers. format is the identical to that accepted by the Headers constructor (see below)
    body: null, // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
    timeout: 3000,
    compress: true
  }

  const getOptions = (
    path = '',
    opts = defaultOpts,
    sevedHost = '',
    savedAuth = ''
  ) => {
    const {
      data,
      type = 'json',
      query = {},
      params = {},
      headers = {},
      ...restOptions
    } = opts
    let { host = '', auth = false, ...options } = restOptions
    host = host || sevedHost
    auth = auth && savedAuth
    const header = setHeader({ headers, ...options, type, auth })
    const body = setBody({ data, type })
    const url = setPath({ host, path, params, query })
    options = {
      ...defaultOpts,
      ...options,
      headers: header,
      ...body
    }
    console.log(url, JSON.stringify(options, null, 2), '\n\n')
    return { url, options }
  }

  const fetchAPI = (url, options) => {
    return fetch(url, options)
      .then(async (res) => {
        const { text = false } = options
        const json = await (text ? res.text() : res.json()).catch(() => ({}))
        return Promise.all([res, json])
      })
      .then(
        ([
          {
            status = 500,
            statusText = 'Internal Server Error',
            ok = false
          } = {},
          data
        ]) => {
          if (ok) {
            return [data]
          } else if (status >= 500) {
            throw new Error(statusText || 'Internal Server Error')
          } else {
            // logError2CloudWatch(url, options, { status, statusText, ...data })
            return [null, { ...data, status }]
          }
        }
      )
      .catch((err) => {
        // logError2CloudWatch(url, options, err)
        throw err
      })
  }
  const API_URL_BACKEND = 'https://api.catalistplus.com/api'
  const auth = false
  return async (ctx, next) => {
    ctx.fetch = (path, opts) => {
      const { url, options } = getOptions(path, opts, API_URL_BACKEND, auth)
      return fetchAPI(url, options)
    }
    await next()
  }
}

/*
  {
    // These properties are part of the Fetch Standard
    method: 'GET',
    headers: {},        // request headers. format is the identical to that accepted by the Headers constructor (see below)
    body: null,         // request body. can be null, a string, a Buffer, a Blob, or a Node.js Readable stream
    redirect: 'follow', // set to `manual` to extract redirect headers, `error` to reject redirect
    signal: null,       // pass an instance of AbortSignal to optionally abort requests

    // The following properties are node-fetch extensions
    follow: 20,         // maximum redirect count. 0 to not follow redirect
    timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable (OS limit applies). Signal is recommended instead.
    compress: true,     // support gzip/deflate content encoding. false to disable
    size: 0,            // maximum response body size in bytes. 0 to disable
    agent: null         // http(s).Agent instance, allows custom proxy, certificate, dns lookup etc.
  }
 */
