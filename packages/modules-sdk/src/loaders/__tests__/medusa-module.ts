import {
  InternalModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/types"
import { MedusaModule } from "../../medusa-module"
import { asValue } from "awilix"

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

describe("Medusa Module", () => {
  beforeEach(() => {
    MedusaModule.clearInstances()
    jest.resetModules()
    jest.clearAllMocks()
  })

  it("MedusaModule bootstrap - Singleton instances", async () => {
    await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      options: {
        abc: 123,
      },
    } as InternalModuleDeclaration)

    expect(mockRegisterMedusaModule).toBeCalledTimes(1)
    expect(mockModuleLoader).toBeCalledTimes(1)

    await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      options: {
        abc: 123,
      },
    } as InternalModuleDeclaration)

    await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      options: {
        different_options: "abc",
      },
    } as InternalModuleDeclaration)

    expect(mockRegisterMedusaModule).toBeCalledTimes(2)
    expect(mockModuleLoader).toBeCalledTimes(2)
  })

  it("MedusaModule - set module and return the first if there is no main", async () => {
    const moduleA = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      options: {
        abc: 123,
      },
    } as InternalModuleDeclaration)

    const moduleB = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      options: {
        different_options: "abc",
      },
    } as InternalModuleDeclaration)

    expect(MedusaModule.getModule("moduleKey")).toEqual(moduleA)
  })

  it("MedusaModule - set module and return the main", async () => {
    const moduleA = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      options: {
        abc: 123,
      },
    } as InternalModuleDeclaration)

    const moduleB = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      main: true,
      options: {
        different_options: "abc",
      },
    } as InternalModuleDeclaration)

    expect(MedusaModule.getModule("moduleKey")).toEqual(moduleB)
  })

  it("MedusaModule - set module and return the alias", async () => {
    const moduleA = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      alias: "mod_A",
      options: {
        abc: 123,
      },
    } as InternalModuleDeclaration)

    const moduleB = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      main: true,
      alias: "mod_B",
      options: {
        different_options: "abc",
      },
    } as InternalModuleDeclaration)

    const moduleC = await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      alias: "mod_C",
      options: {
        moduleC: true,
      },
    } as InternalModuleDeclaration)

    // main
    expect(MedusaModule.getModule("moduleKey")).toEqual(moduleB)

    expect(MedusaModule.getModule("moduleKey", "mod_A")).toEqual(moduleA)
    expect(MedusaModule.getModule("moduleKey", "mod_B")).toEqual(moduleB)
    expect(MedusaModule.getModule("moduleKey", "mod_C")).toEqual(moduleC)
  })

  it("MedusaModule - Prevent two main modules being set as main", async () => {
    await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      alias: "mod_A",
      options: {
        abc: 123,
      },
    } as InternalModuleDeclaration)

    await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      main: true,
      alias: "mod_B",
      options: {
        different_options: "abc",
      },
    } as InternalModuleDeclaration)

    const moduleC = MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      main: true,
      alias: "mod_C",
      options: {
        moduleC: true,
      },
    } as InternalModuleDeclaration)

    expect(moduleC).rejects.toThrow(
      "Module moduleKey already have a 'main' registered."
    )
  })

  it("MedusaModule - Prevent same alias being used", async () => {
    await MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      alias: "module_alias",
      options: {
        different_options: "abc",
      },
    } as InternalModuleDeclaration)

    const moduleC = MedusaModule.bootstrap("moduleKey", "@path", {
      scope: MODULE_SCOPE.INTERNAL,
      resources: MODULE_RESOURCE_TYPE.ISOLATED,
      resolve: "@path",
      alias: "module_alias",
      options: {
        moduleC: true,
      },
    } as InternalModuleDeclaration)

    expect(moduleC).rejects.toThrow(
      "Module moduleKey already registed as 'module_alias'. Please choose a different alias."
    )
  })
})
