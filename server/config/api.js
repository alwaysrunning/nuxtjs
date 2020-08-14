/**
 * 1. named const with UPPERCASE, ex: const EXAMPLE = {}
 * 2. named key with a noun, ex: { key: '/ex' }
 * 3. named value start with '/', ex: { ex: '/value' }
 */
const APP = {
  cmsConfig: '/cms/messages/:platformId'
}

const METHOD = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE'
}

module.exports = {
  METHOD,
  APP
}
