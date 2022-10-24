export default {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
  },

  plugins: ['prettier'],

  rules: {
    semi: 0,
    radix: 0,
    'no-use-before-define': 0,
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        singleQuote: true,
        printWidth: 140,
        tabWidth: 2,
      },
    ],
  },
}
