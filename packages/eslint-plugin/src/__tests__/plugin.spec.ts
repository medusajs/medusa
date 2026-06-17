import plugin from "../index"

describe("@medusajs/eslint-plugin", () => {
  it("exposes a meta block with the plugin name", () => {
    expect(plugin.meta).toEqual({ name: "@medusajs/eslint-plugin" })
  })

  it("registers the no-async-workflow-constructor rule", () => {
    expect(Object.keys(plugin.rules)).toContain("no-async-workflow-constructor")
  })

  it("ships recommended, strict, and modules flat configs", () => {
    expect(Object.keys(plugin.configs)).toEqual([
      "recommended",
      "strict",
      "modules",
    ])
    expect(Array.isArray(plugin.configs.recommended)).toBe(true)
    expect(Array.isArray(plugin.configs.strict)).toBe(true)
    expect(Array.isArray(plugin.configs.modules)).toBe(true)
  })

  it("modules preset registers the plugin and applies module rules", () => {
    const modules = plugin.configs.modules as Array<Record<string, unknown>>

    const pluginBlock = modules.find((block) => block.plugins && !block.files)
    expect(pluginBlock).toBeDefined()
    expect((pluginBlock!.plugins as Record<string, unknown>)["@medusajs"]).toBe(
      plugin
    )

    // Rules are split across blocks scoped by concern (services, module
    // definition, data models); collect them all to assert coverage.
    const allRules = Object.assign(
      {},
      ...modules
        .filter((block) => block.rules)
        .map((block) => block.rules as Record<string, unknown>)
    )
    expect(allRules).toHaveProperty("@medusajs/service-methods-must-be-async")
    expect(allRules).toHaveProperty("@medusajs/module-name-snake-case")
    expect(allRules).toHaveProperty(
      "@medusajs/data-model-table-name-snake-case"
    )

    // Module-definition rule is scoped to the entry file, not the broad block.
    const moduleDefBlock = modules.find(
      (block) =>
        block.rules &&
        (block.rules as Record<string, unknown>)[
          "@medusajs/module-name-snake-case"
        ]
    )
    expect(moduleDefBlock!.files).toContain("src/index.{ts,js}")

    // Data-model rules are scoped to models directories.
    const modelsBlock = modules.find(
      (block) =>
        block.rules &&
        (block.rules as Record<string, unknown>)[
          "@medusajs/primary-key-required"
        ]
    )
    expect(modelsBlock!.files).toContain("**/models/**/*.{ts,js}")
  })

  it("recommended preset includes a global-ignores block, a global plugin registration, and a TS parser block", () => {
    const recommended = plugin.configs.recommended as Array<
      Record<string, unknown>
    >
    const ignoresOnly = recommended.find(
      (block) => block.ignores && !block.files && !block.rules
    )
    expect(ignoresOnly).toBeDefined()

    // The plugin is registered in a `files`-less global block so that EVERY
    // linted file (including `.js` files matched by rule blocks) can resolve
    // `@medusajs/*` rule references — it is intentionally not scoped to TS.
    const pluginBlock = recommended.find(
      (block) => block.plugins && !block.files
    )
    expect(pluginBlock).toBeDefined()
    expect((pluginBlock!.plugins as Record<string, unknown>)["@medusajs"]).toBe(
      plugin
    )

    // The TypeScript parser stays scoped to TS files.
    const parserBlock = recommended.find(
      (block) =>
        Array.isArray(block.files) &&
        (block.languageOptions as Record<string, unknown> | undefined)?.parser
    )
    expect(parserBlock).toBeDefined()
  })
})
