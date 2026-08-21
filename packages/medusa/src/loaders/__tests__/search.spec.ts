import { isSearchModuleEnabled, loadSearchIndexes } from "../search"

const load = jest.fn()

jest.mock("@medusajs/framework/search", () => ({
  SearchIndexLoader: jest.fn().mockImplementation(() => ({ load })),
}))

const logger = { info: jest.fn(), debug: jest.fn() } as any

// `resolve` is where a plugin's compiled sources live — for the application
// itself that is `<project>/.medusa/server/src` — and index definitions are
// discovered under its `search/` folder, like `links/` for links.
const plugins = [{ resolve: "/app" }] as any

describe("isSearchModuleEnabled", () => {
  it("is false when no module is configured", () => {
    expect(isSearchModuleEnabled({ modules: {} } as any)).toBe(false)
    expect(isSearchModuleEnabled({} as any)).toBe(false)
  })

  it("is false when the module is disabled", () => {
    expect(
      isSearchModuleEnabled({ modules: { search: { disable: true } } } as any)
    ).toBe(false)
    expect(isSearchModuleEnabled({ modules: { search: false } } as any)).toBe(
      false
    )
  })

  it("is true when the module is registered", () => {
    expect(
      isSearchModuleEnabled({ modules: { search: { resolve: "x" } } } as any)
    ).toBe(true)
    expect(isSearchModuleEnabled({ modules: { search: true } } as any)).toBe(
      true
    )
  })
})

describe("loadSearchIndexes", () => {
  beforeEach(() => jest.clearAllMocks())

  // Discovery imports project files, so it must not run when search is off —
  // there would be nothing to hand the definitions to.
  it("does not scan or import anything when the module is not configured", async () => {
    await loadSearchIndexes({
      plugins,
      configModule: { modules: {} } as any,
      logger,
    })

    expect(load).not.toHaveBeenCalled()
  })

  it("loads the 'search' folder of every plugin when the module is configured", async () => {
    const { SearchIndexLoader } = require("@medusajs/framework/search")

    await loadSearchIndexes({
      plugins,
      configModule: { modules: { search: { resolve: "x" } } } as any,
      logger,
    })

    expect(SearchIndexLoader).toHaveBeenCalledWith(["/app/search"], logger)
    expect(load).toHaveBeenCalledTimes(1)
  })
})
