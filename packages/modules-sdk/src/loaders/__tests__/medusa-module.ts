import {
  InternalModuleDeclaration,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/types"
import { MedusaModule } from "../../medusa-module"

const mockRegisterMedusaModule = jest
  .fn()
  .mockImplementation(() => Promise.resolve([]))
const mockModuleLoader = jest.fn().mockImplementation(() => Promise.resolve({}))

jest.mock("./../../loaders", () => ({
  registerMedusaModule: jest
    .fn()
    .mockImplementation((...args) => mockRegisterMedusaModule()),
  moduleLoader: jest.fn().mockImplementation((...args) => mockModuleLoader()),
}))

describe("Medusa Module", () => {
  beforeEach(() => {
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
})
