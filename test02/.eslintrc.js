module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    "strict": 2,//使用严格模式
    "no-undef": 2,//不能有未定义的变量
    "no-use-before-define": 2,//未定义前不能使用
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    // 'no-undef': 'off',
    'camelcase': 'off',
    "eol-last": 0,
    "semi": 0,
    'indent': 'off',
    "space-before-function-paren": [
      0,
      "never"
    ],
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}