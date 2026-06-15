import plugin from "../index"

describe("@medusajs/eslint-plugin", () => {
  it("exposes a meta block with the plugin name", () => {
    expect(plugin.meta).toEqual({ name: "@medusajs/eslint-plugin" })
  })

  it("registers the no-async-workflow-constructor rule", () => {
    expect(Object.keys(plugin.rules)).toContain(
      "no-async-workflow-constructor"
    )
  })

  it("ships recommended and strict flat configs", () => {
    expect(Object.keys(plugin.configs)).toEqual(["recommended", "strict"])
    expect(Array.isArray(plugin.configs.recommended)).toBe(true)
    expect(Array.isArray(plugin.configs.strict)).toBe(true)
  })

  it("recommended preset includes a global-ignores block and a global plugin registration", () => {
    const recommended = plugin.configs.recommended as Array<Record<string, unknown>>
    const ignoresOnly = recommended.find(
      (block) => block.ignores && !block.files && !block.rules
    )
    expect(ignoresOnly).toBeDefined()

    // The plugin is registered in a `files`-less global block so that EVERY
    // linted file (including `.js` files matched by rule blocks) can resolve
    // `@medusajs/*` rule references.
    const pluginBlock = recommended.find(
      (block) => block.plugins && !block.files
    )
    expect(pluginBlock).toBeDefined()
    expect((pluginBlock!.plugins as Record<string, unknown>)["@medusajs"]).toBe(
      plugin
    )

    // The TS parser stays scoped to TypeScript files.
    const parserBlock = recommended.find(
      (block) =>
        Array.isArray(block.files) &&
        (block.languageOptions as Record<string, unknown> | undefined)?.parser
    )
    expect(parserBlock).toBeDefined()
  })
})
