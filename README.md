# @kevinmarrec/eslint-config

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions][github-actions-src]][github-actions-href]

> Based on [@antfu/eslint-config](https://github.com/antfu/eslint-config) by [Anthony Fu](https://github.com/antfu) :
> - Single quotes, no semi
> - Auto fix for formatting (aimed to be used standalone without Prettier)
> - Designed to work with TypeScript, Vue out-of-box
> - Lint also for json, yaml, markdown
> - Sorted imports, dangling commas for cleaner commit diff
> - Reasonable defaults, best practices, only one-line of config

Additionnally, this configuration overrides some rules to match my personal preferences :

- `@typescript-eslint/no-unused-vars` : Warning (`warn`) instead of Error (`error`)
- `@typescript-eslint/space-before-function-paren` : Set to `always` for spaces before function parenthesis

## Usage

### Install

```bash
pnpm add -D eslint @kevinmarrec/eslint-config
```

### Config `.eslintrc`

```json
{
  "extends": "@kevinmarrec"
}
```

### Add script for package.json

For example:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

### Config VS Code auto fix

Install [VS Code ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and create `.vscode/settings.json`

```json
{
  "prettier.enable": false,
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Copyright

This configuration is based on [@antfu/eslint-config](https://github.com/antfu/eslint-config) by [Anthony Fu](https://github.com/antfu)

## License

Made with ❤️

Published under the [MIT License](./LICENSE)

[npm-version-src]: https://img.shields.io/npm/v/@kevinmarrec/eslint-config?style=flat-square
[npm-version-href]: https://npmjs.com/package/@kevinmarrec/eslint-config
[npm-downloads-src]: https://img.shields.io/npm/dm/@kevinmarrec/eslint-config?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@kevinmarrec/eslint-config
[github-actions-src]: https://img.shields.io/github/actions/workflow/status/kevinmarrec/eslint-config/ci.yml?style=flat-square
[github-actions-href]: https://github.com/kevinmarrec/eslint-config/actions/workflows/ci.yml
