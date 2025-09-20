# @kevinmarrec/eslint-config

## Description

Opinionated [ESLint](https://eslint.org) config.

## Opinions

- Extends [@antfu/eslint-config](https://github.com/antfu/eslint-config) with [formatters](https://github.com/antfu/eslint-config?tab=readme-ov-file#formatters) & [UnoCSS](https://github.com/antfu/eslint-config?tab=readme-ov-file#unocss) support (`uno.config.ts` detection)
  - with quite minor rule overrides:
    - [antfu/if-newline](https://github.com/antfu/eslint-plugin-antfu/blob/main/src/rules/if-newline.ts) is disabled
    - [import/consistent-type-specifier-style](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/consistent-type-specifier-style.md) is disabled
    - [import/no-duplicates](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md) is overridden to prefer inline type imports
    - [perfectionist/sort-imports](https://perfectionist.dev/rules/sort-imports.html) is overridden with custom groups order and enforced new lines between groups
  - and some additional rules:
    - [vue/no-unused-properties](https://eslint.vuejs.org/rules/no-unused-properties) is enabled

- Disables [unsupported TypeScript version warning](https://typescript-eslint.io/packages/parser/#warnonunsupportedtypescriptversion)

- Opinionated, but [very customizable](https://github.com/antfu/eslint-config?tab=readme-ov-file#customization)

## Usage

> Requires [ESLint](https://eslint.org) v9 _or later_.

### Default

```ts
// eslint.config.ts
export { default } from '@kevinmarrec/eslint-config'
```

### Extended

```ts
// eslint.config.ts
import { useConfig } from '@kevinmarrec/eslint-config'

export default useConfig({ /* options */ })
```
