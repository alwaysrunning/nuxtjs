const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const isProd = process.env.NODE_ENV === 'production'

require('dotenv').config() // 服务端读取.env配置文件，设置到全局变量（process.env）中去
module.exports = {
  // srcDir: 'src/',
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui', '@/plugins/axios', '@/plugins/mixins'],
  /*
   ** Global CSS
   */
  css: ['element-ui/lib/theme-chalk/index.css', '@/assets/css/all.scss'],

  styleResources: {
    scss: ['@/assets/css/var.scss']
  },

  server: {
    timing: { total: true },
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/style-resources'
  ],
  env: process.env, // 客户端读取.env的配置环境（客户端和服务端保持一致，都是读取env配置文件，生产全局变量）
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000,
    // https: IsProd,
    debug: true
  },
  // buildDir: process.env.BUILD_DIR || 'dist',
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    quiet: false,
    ssr: true,
    plugins: [
      new webpack.NormalModuleReplacementPlugin(
        /element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/,
        'element-ui/lib/locale/lang/en'
      )
    ],
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          sourceMap: !isProd,
        }),
      ],
      splitChunks: {
        minSize: 30000,
        maxSize: 100000,
        chunks: 'all',
        automaticNameDelimiter: '.',
        name: true,
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.scss|\.css|\.less$/,
            enforce: true,
            priority: 20,
          },
          element: {
            name: 'element-ui',
            test: module => /element-ui/.test(module.context),
            priority: 10,
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'initial',
            priority: -10,
            minChunks: 2,
          },
          default: {
            reuseExistingChunk: true,
            priority: -20,
            minChunks: 2,
          },
        }
      },
    },
    extractCSS: isProd,
    extend(config, { isDev, isClient, isServer }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    }
  }
}
