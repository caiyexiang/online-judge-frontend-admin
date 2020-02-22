module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  extends: ["plugin:vue/recommonded", "@vue/prettier"],

  rules: {
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    semi: [
      'error',
      'never'
    ],
    'no-irregular-whitespace': [
      'error',
      {
        skipComments: true,
        skipTemplates: true
      }
    ],
    'no-unused-vars': [
      'warn'
    ],
    'arrow-spacing': [
      'error',
      {
        before: true,
        after: true
      }
    ]
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
};
