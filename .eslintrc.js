module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'plugin:nuxt/recommended',
    'plugin:prettier/recommended',
    'plugin:vue/essential',
    // 'plugin:vue/strongly-recommended',
  ],
  plugins: [
    'vue',
    'prettier',
  ],
  // add your custom rules here
  rules: {
    'no-void': 0,
    'no-console': 0,
    'no-unreachable': 1,
    'no-useless-escape': 0,
    'no-callback-literal': 0,
    'no-multiple-empty-lines': [1, { 'max': 2 }],
    'nuxt/no-cjs-in-config': 'off',
    'vue/camelcase': 'error', // enforce camelcase naming convention
    'vue/eqeqeq': 'error', // require the use of === and !==
    'vue/script-indent': 'error', // enforce consistent indentation in <script>
    'vue/space-infix-ops': 'warn', // require spacing around infix operators
    'vue/html-self-closing': 'off',
    'vue/v-on-function-call': 'warn', // enforce or forbid parentheses after method calls without arguments in v-on directives
    'vue/array-bracket-spacing': 'warn', // enforce consistent spacing inside array brackets
    'vue/singleline-html-element-content-newline': 'off',
    'prettier/prettier': 0,
    'no-unsafe-negation': 'off',
    'no-negated-in-lhs': 'off'
  }
}
