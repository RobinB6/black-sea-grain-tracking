module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['standard-with-typescript'],
  overrides: [
    {
      files: ['*'],
      rules: {
        '@typescript-eslint/strict-boolean-expressions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/semi': 'off',
        'no-tabs': 'off'
      }
    }
  ],
  rules: {
    semi: [2, 'always']
  },
  parserOptions: {
    project: ['tsconfig.json']
  },
  ignorePatterns: ['spec/*', 'src/app/data-grid/*', '*.spec.ts']
};
