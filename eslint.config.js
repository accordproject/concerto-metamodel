// eslint.config.js
const jsdocPlugin = require('eslint-plugin-jsdoc');

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                es6: true,
                node: true,
                mocha: true,
            },
        },
        plugins: {
            jsdoc: jsdocPlugin,
        },
        rules: {
            indent: ['error', 4],
            'linebreak-style': [
                'warn',
                require('os').EOL === '\r\n' ? 'windows' : 'unix',
            ],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'no-unused-vars': ['error', { args: 'none' }],
            'no-console': 'warn',
            curly: 'error',
            eqeqeq: 'error',
            'no-throw-literal': 'error',
            strict: 'error',
            'no-var': 'error',
            'dot-notation': 'error',
            'no-tabs': 'error',
            'no-trailing-spaces': 'error',
            'no-useless-call': 'error',
            'no-with': 'error',
            'operator-linebreak': 'error',
            'jsdoc/require-jsdoc': [
                'error',
                {
                    contexts: [
                        'ClassDeclaration',
                        'MethodDefinition',
                        'FunctionDeclaration',
                    ],
                },
            ],
            'jsdoc/require-description': 'error',
            'jsdoc/check-tag-names': 'error',
            yoda: 'error',
        },
    },
];
