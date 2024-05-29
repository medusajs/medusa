import { InternalModuleDeclaration } from "@medusajs/types"
import { MODULE_RESOURCE_TYPE, MODULE_SCOPE } from "../../types"

import { asValue } from "awilix"
import { MedusaModule } from "../../medusa-module"

const mockRegisterMedusaModule = jest.fn().mockImplementation(() => {
  return {
    moduleKey: {
      definition: {
        key: "moduleKey",
        registrationName: "moduleKey",
      },
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.SHARED,
      },
    },
  }
})

const mockModuleLoader = jest.fn().mockImplementation(({ container }) => {
  container.register({
    moduleKey: asValue({}),
  })
  return Promise.resolve({})
})

jest.mock("./../../loaders", () => ({
  registerMedusaModule: jest
    .fn()
    .mockImplementation((...args) => mockRegisterMedusaModule()),
  moduleLoader: jest
    .fn()
    .mockImplementation((...args) => mockModuleLoader.apply(this, args)),
}))

describe("Medusa Modules", () => {
  beforeEach(() => {
    MedusaModule.clearInstances()
    jest.resetModules()
    jest.clearAllMocks()
  })

  it("should create singleton instances", async () => {
    await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    expect(mockRegisterMedusaModule).toBeCalledTimes(1)
    expect(mockModuleLoader).toBeCalledTimes(1)

    await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    expect(mockRegisterMedusaModule).toBeCalledTimes(2)
    expect(mockModuleLoader).toBeCalledTimes(2)
  })

  it("should prevent the module being loaded multiple times under concurrent requests", async () => {
    const load: any = []

    for (let i = 5; i--; ) {
      load.push(
        MedusaModule.bootstrap({
          moduleKey: "moduleKey",
          defaultPath: "@path",
          declaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.ISOLATED,
            resolve: "@path",
            options: {
              abc: 123,
            },
          } as InternalModuleDeclaration,
        })
      )
    }

    const intances = Promise.all(load)

    expect(mockRegisterMedusaModule).toBeCalledTimes(1)
    expect(mockModuleLoader).toBeCalledTimes(1)
    expect(intances[(await intances).length - 1]).toBe(intances[0])
  })

  it("getModuleInstance should return the first instance of the module if there is none flagged as 'main'", async () => {
    const moduleA = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    const moduleB = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    expect(MedusaModule.getModuleInstance("moduleKey")).toEqual(moduleA)
  })

  it("should return the module flagged as 'main' when multiple instances are available", async () => {
    const moduleA = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    const moduleB = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        main: true,
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    expect(MedusaModule.getModuleInstance("moduleKey")).toEqual(moduleB)
  })

  it("should retrieve the module by their given alias", async () => {
    const moduleA = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        alias: "mod_A",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    const moduleB = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        main: true,
        alias: "mod_B",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    const moduleC = await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        alias: "mod_C",
        options: {
          moduleC: true,
        },
      } as InternalModuleDeclaration,
    })

    // main
    expect(MedusaModule.getModuleInstance("moduleKey")).toEqual(moduleB)

    expect(MedusaModule.getModuleInstance("moduleKey", "mod_A")).toEqual(
      moduleA
    )
    expect(MedusaModule.getModuleInstance("moduleKey", "mod_B")).toEqual(
      moduleB
    )
    expect(MedusaModule.getModuleInstance("moduleKey", "mod_C")).toEqual(
      moduleC
    )
  })

  it("should prevent two main modules being set as 'main'", async () => {
    await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        alias: "mod_A",
        options: {
          abc: 123,
        },
      } as InternalModuleDeclaration,
    })

    await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        main: true,
        alias: "mod_B",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    const moduleC = MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        main: true,
        alias: "mod_C",
        options: {
          moduleC: true,
        },
      } as InternalModuleDeclaration,
    })

    expect(moduleC).rejects.toThrow(
      "Module moduleKey already have a 'main' registered."
    )
  })

  it("should prevent the same alias be used for different instances of the same module", async () => {
    await MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        alias: "module_alias",
        options: {
          different_options: "abc",
        },
      } as InternalModuleDeclaration,
    })

    const moduleC = MedusaModule.bootstrap({
      moduleKey: "moduleKey",
      defaultPath: "@path",
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resources: MODULE_RESOURCE_TYPE.ISOLATED,
        resolve: "@path",
        alias: "module_alias",
        options: {
          moduleC: true,
        },
      } as InternalModuleDeclaration,
    })

    expect(moduleC).rejects.toThrow(
      "Module moduleKey already registed as 'module_alias'. Please choose a different alias."
    )
  })
})
