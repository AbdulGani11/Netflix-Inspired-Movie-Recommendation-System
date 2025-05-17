export const env = {
    node: true,
    es2020: true
};
export const parserOptions = {
    ecmaVersion: 2020,
    sourceType: 'module'
};
export const rules = {
    'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_'
    }]
};