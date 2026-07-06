import { Config } from "../config"

describe("Config", () => {
  beforeEach(() => {
    Config.reset()
  })

  afterEach(() => {
    Config.reset()
  })

  describe("load() with override (bypasses file reading)", () => {
    it("returns package defaults when called with an empty override", () => {
      const config = Config.load({})
      expect(config.tsconfig).toBe("tsconfig.json")
      expect(config.publicPrefixes).toEqual(["Admin", "Store"])
      expect(config.importSources.commonRequest).toBe("@medusajs/framework/types")
      expect(config.importSources.dal).toBe("@medusajs/framework/types")
      expect(config.outputBase).toBe("src/types/http")
    })

    it("deep-merges a partial override over defaults", () => {
      const config = Config.load({
        outputBase: "packages/core/types/src/http",
        tsconfig: "_tsconfig.base.json",
        importSources: {
          commonRequest: "packages/core/types/src/http/common",
          dal: "packages/core/types/src/dal",
        },
      })

      expect(config.outputBase).toBe("packages/core/types/src/http")
      expect(config.tsconfig).toBe("_tsconfig.base.json")
      expect(config.importSources.commonRequest).toBe(
        "packages/core/types/src/http/common"
      )
      expect(config.importSources.dal).toBe("packages/core/types/src/dal")
      // Unchanged defaults
      expect(config.publicPrefixes).toEqual(["Admin", "Store"])
    })

    it("deep-merges validatorGlobs over defaults", () => {
      const config = Config.load({
        validatorGlobs: {
          admin: "packages/medusa/src/api/admin/*/validators.ts",
          store: "packages/medusa/src/api/store/*/validators.ts",
        },
      })

      expect(config.validatorGlobs.admin).toBe(
        "packages/medusa/src/api/admin/*/validators.ts"
      )
      expect(config.validatorGlobs.store).toBe(
        "packages/medusa/src/api/store/*/validators.ts"
      )
    })

    it("sets projectRoot to process.cwd() when using an override", () => {
      const config = Config.load({})
      expect(config.projectRoot).toBe(process.cwd())
    })

    it("load() with override replaces the cached instance returned by get()", () => {
      Config.load({}) // prime the cache with defaults
      const overridden = Config.load({ outputBase: "overridden/path" })
      expect(Config.get()).toBe(overridden)
      expect(Config.get().outputBase).toBe("overridden/path")
    })
  })

  describe("get() / reset()", () => {
    it("get() returns the same cached instance on repeated calls", () => {
      const a = Config.get()
      const b = Config.get()
      expect(a).toBe(b)
    })

    it("reset() clears the singleton so the next call reloads", () => {
      const first = Config.load({ outputBase: "custom/path" })
      Config.reset()
      const second = Config.load({})
      expect(first.outputBase).toBe("custom/path")
      expect(second.outputBase).toBe("src/types/http")
    })
  })

  describe("DEFAULTS", () => {
    it("exposes the package-level default values", () => {
      expect(Config.DEFAULTS.tsconfig).toBe("tsconfig.json")
      expect(Config.DEFAULTS.publicPrefixes).toEqual(["Admin", "Store"])
    })
  })
})
