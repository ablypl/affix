module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        // add more generic rulesets here, such as:
        'eslint:recommended',
        'plugin:vue/recommended'
    ],
    rules: {
        // override/add rules settings here, such as:
        'vue/no-unused-vars': 'error',
        'semi': 'error',
        'indent': 2,
        'vue/max-attributes-per-line': ['error', {
            'singleline': 3,
            'multiline': {
                'max': 1,
                'allowFirstLine': false
            }
        }],
        'object-curly-spacing': ['error', 'always'],
        'prefer-const': ['error', {
            'destructuring': 'any',
            'ignoreReadBeforeAssign': false
        }]
    }
}
