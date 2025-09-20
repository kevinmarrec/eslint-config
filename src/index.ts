import { antfu } from '@antfu/eslint-config'
import defu from 'defu'
import { globSync } from 'tinyglobby'

type Options = Parameters<typeof antfu>[0]
type UserConfig = Parameters<typeof antfu>[1]

export function useConfig(options: Options = {}, ...userConfigs: UserConfig[]) {
  const [unoConfig] = globSync('**/uno.config.ts', { absolute: true })

  if (options.unocss !== false && unoConfig) {
    options.unocss = true
  }

  if (options.unocss) {
    options.unocss = defu(options.unocss, {
      attributify: false,
      strict: true,
    })
  }

  return antfu(defu<NonNullable<Options>, Options[]>(options, {
    formatters: true,
    ignores: options.ignores,
    vue: {
      a11y: true,
      overrides: {
        'vue/no-unused-properties': 'error',
        'vue-a11y/label-has-for': ['error', {
          required: {
            some: ['nesting', 'id'],
          },
        }],
      },
    },
    rules: {
      'antfu/if-newline': ['off'],
      'import/consistent-type-specifier-style': ['off'],
      'import/no-duplicates': ['error', { 'prefer-inline': true }],
      'perfectionist/sort-imports': ['error', {
        groups: [
          ['builtin', 'builtin-type'],
          ['external', 'external-type'],
          ['internal', 'internal-type'],
          ['parent', 'parent-type', 'sibling', 'sibling-type', 'index', 'index-type'],
          'side-effect',
          'object',
          'unknown',
        ],
        newlinesBetween: 'always',
        order: 'asc',
        type: 'natural',
      }],
    },
    settings: {
      unocss: {
        configPath: unoConfig,
      },
    },
  }), ...userConfigs)
}

export default useConfig()
