module.exports = {
    rules: {
        '@typescript-eslint/no-unused-vars': ['error', {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_'
        }],
        '@typescript-eslint/no-explicit-any': 'warn',
        'react/no-unescaped-entities': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        '@next/next/no-img-element': 'warn',
        'react/jsx-no-comment-textnodes': 'warn',
        'prefer-const': 'warn'
    }
};
