import fs from 'node:fs/promises'
import os from 'node:os'
import process from 'node:process'

import { ESLint } from 'eslint'
import { resolve } from 'pathe'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useConfig } from '../src'

describe('config', async () => {
  let tmpDir: string

  beforeEach(async () => {
    const osTmpDir = os.tmpdir()
    tmpDir = await fs.mkdtemp(resolve(osTmpDir, `eslint-config-`))
    vi.spyOn(process, 'cwd').mockReturnValue(tmpDir)
  })

  afterEach(async () => {
    await fs.rm(tmpDir, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('should disable antfu/if-newline', async () => {
    const eslint = new ESLint({
      fix: true,
      overrideConfigFile: true,
      overrideConfig: await useConfig({
        typescript: true,
      }),
    })

    const code = `
    export function foo() {
      if (condition) return false;
      return true
    }
    `

    const [{ errorCount, output }] = await eslint.lintText(code, { filePath: 'typescript.ts' })

    expect(errorCount).toBe(0)
    expect(output).toMatchInlineSnapshot(`
      "export function foo() {
        if (condition) return false
        return true
      }
      "
    `)
  })

  it('should lint imports in typescript files', async () => {
    const eslint = new ESLint({
      fix: true,
      overrideConfigFile: true,
      overrideConfig: await useConfig({
        rules: {
          'unused-imports/no-unused-imports': 'off',
        },
        typescript: true,
      }),
    })

    const code = `
    import { C, c, B, b, A, a } from '~/internal'
    import { foo, type Foo } from './sibiling'
    import type { Bar } from './sibiling'
    import assert from 'node:assert'
    import type { Baz } from '../parent'
    import { type Qux } from '../parent'
    import external from 'external'
    import path from 'path'
    import index from '.'
    `

    const [{ output }] = await eslint.lintText(code, { filePath: 'typescript.ts' })

    await expect(output).toMatchInlineSnapshot(`
      "import assert from 'node:assert'
      import path from 'node:path'

      import external from 'external'

      import { A, a, B, b, C, c } from '~/internal'

      import index from '.'
      import type { Baz, Qux } from '../parent'
      import { type Bar, foo, type Foo } from './sibiling'
      "
    `)
  })

  it('should report issue when finding unused prop in .vue files', async () => {
    const eslint = new ESLint({
      fix: true,
      overrideConfigFile: true,
      overrideConfig: await useConfig({
        typescript: true,
      }),
    })

    const code = `
      <script setup lang="ts">
        defineProps<{ foo: string }>()
      </script>
    `

    const [{ errorCount, messages }] = await eslint.lintText(code, { filePath: 'vue.vue' })

    expect(errorCount).toBe(1)
    expect(messages.length).toBe(1)
    expect(messages[0].message).toMatchInlineSnapshot(`"'foo' of property found, but never used."`)
  })

  it('should not require inputs with labels to validate for both nesting and id checks (vue-a11y/label-has-for)', async () => {
    const eslint = new ESLint({
      fix: true,
      overrideConfigFile: true,
      overrideConfig: await useConfig({}),
    })
    const code = `
    <template>
      <div>
        <label for="foo">Foo</label>
        <input id="foo" />
      </div>
      <div>
        <label>
          <span>Foo</span>
          <input />
        </label>
      </div>
    </template>
    `

    const [{ errorCount }] = await eslint.lintText(code, { filePath: 'vue.vue' })

    expect(errorCount).toBe(0)
  })

  it('should ignore files, given "ignores" option', async () => {
    const eslint = new ESLint({
      overrideConfigFile: true,
      overrideConfig: await useConfig({ ignores: ['**/*.foo'] }),
    })

    const [{ warningCount, messages }] = await eslint.lintText('', { filePath: 'file.foo' })

    expect(warningCount).toBe(1)
    expect(messages).toMatchInlineSnapshot(`
      [
        {
          "fatal": false,
          "message": "File ignored because of a matching ignore pattern. Use "--no-ignore" to disable file ignore settings or use "--no-warn-ignored" to suppress this warning.",
          "nodeType": null,
          "ruleId": null,
          "severity": 1,
        },
      ]
    `)
  })

  it('should load antfu/unocss lint rules, when uno.config.ts file is found', async () => {
    await fs.writeFile(resolve(tmpDir, 'uno.config.ts'), `export default {}`)

    expect(await useConfig()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'antfu/unocss',
          rules: expect.objectContaining({
            'unocss/order': 'warn',
            'unocss/blocklist': 'error',
          }),
        }),
      ]),
    )
  })

  it('should not load antfu/unocss lint rules, when uno.config.ts is not found', async () => {
    expect(await useConfig()).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'antfu/unocss',
        }),
      ]),
    )
  })
})
