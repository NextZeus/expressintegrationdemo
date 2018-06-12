module.exports = {
    extends: 'eslint:recommended',
    env:     {
        node:  true,
        es6:   true,
        mocha: true
    },
    rules: {
        'no-console':              'off',
        'indent':                  ['error', 4, { 'SwitchCase': 1 }],
        'quotes':                  ['error', 'single'],
        'no-extra-boolean-cast':   ['off'],
        // 最大空行数
        'no-multiple-empty-lines': ['warn', {'max': 2}],
        // 函数调用时 函数名与()之间不能有空格
        'no-spaced-func':          'error',
        // 一行结束后面不要有空格
        'no-trailing-spaces':      'warn',
        // 必须使用 if(){} 中的{}
        'curly':                   ['error', 'all'],
        // 注释风格要不要有空格
        'spaced-comment':          1,
        // 逗号前面不能由空格, 后面要空格
        'comma-spacing':           ['error', {'before': false, 'after': true}],
        // 操作符周围有空格
        'space-infix-ops':         ['error', {'int32Hint': false}],
        // 冒号前面不能有空格, 后面必须有空格, 键值需水平对齐
        'key-spacing':             ['error', {'beforeColon': false, 'afterColon': true, 'align': 'value'}],
        // 关键字空格
        'keyword-spacing':         ['error', {'before': true, 'after': true}],
        // 强制使用一致的缩进 第二个参数为 "tab" 时，会使用tab，
        // if while function 后面的{必须与if在同一行
        'brace-style':             ['error', '1tbs', {'allowSingleLine': true}],
    },
    parserOptions: {
        'sourceType':   'module',
        'ecmaVersion':  8,
        'ecmaFeatures': {
            'jsx':                          true,
            'experimentalObjectRestSpread': true
        }
    }
};