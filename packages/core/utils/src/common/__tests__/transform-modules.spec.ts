import { MODULE_PACKAGE_NAMES, Modules } from "../../modules-sdk"
import { transformModules } from "../define-config"

describe("transformModules", () => {
  test("convert array of modules to an object", () => {
    const modules = transformModules([
      {
        resolve: require.resolve("../__fixtures__/define-config/github"),
        options: {
          apiKey: "test",
        },
      },
    ])

    expect(modules).toEqual({
      GithubModuleService: {
        options: {
          apiKey: "test",
        },
        resolve: require.resolve("../__fixtures__/define-config/github"),
      },
    })
  })

  test("transform default module", () => {
    const modules = transformModules([
      {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
      },
    ])

    expect(modules).toEqual({
      cache: {
        resolve: "@zjedene-medusa/medusa/cache-inmemory",
      },
    })
  })

  test("should manage loading priority of modules when its disabled at a later stage in the array", () => {
    const modules = transformModules([
      {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
      },
      {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
        disable: true,
      },
    ])

    expect(modules).toEqual({
      cache: {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
        disable: true,
      },
    })
  })

  test("should manage loading priority of modules when its not disabled at a later stage in the array", () => {
    const modules = transformModules([
      {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
        disable: true,
      },
      {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
      },
    ])

    expect(modules).toEqual({
      cache: {
        resolve: MODULE_PACKAGE_NAMES[Modules.CACHE],
      },
    })
  })
})
