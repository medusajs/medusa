import {
  asFunction,
  asValue,
  AwilixContainer,
  ClassOrFunctionReturning,
  createContainer,
  Resolver
} from "awilix"
import {
  ConfigModule,
  MedusaContainer,
  ModuleResolution,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE
} from "../../types/global"
import Logger from "../logger"
import registerModules from "../module"
import { trackInstallation } from "../__mocks__/medusa-telemetry"

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer): unknown[] =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}

const buildConfigModule = (
  configParts: Partial<ConfigModule>
): ConfigModule => {
  return {
    projectConfig: {
      database_type: "sqlite",
      database_logging: "all",
    },
    featureFlags: {},
    modules: {},
    moduleResolutions: {},
    plugins: [],
    ...configParts,
  }
}

const buildContainer = () => {
  const container = createContainer() as MedusaContainer

  container.registerAdd = function (
    this: MedusaContainer,
    name: string,
    registration: typeof asFunction | typeof asValue
  ): MedusaContainer {
    const storeKey = name + "_STORE"

    if (this.registrations[storeKey] === undefined) {
      this.register(storeKey, asValue([] as Resolver<unknown>[]))
    }
    const store = this.resolve(storeKey) as (
      | ClassOrFunctionReturning<unknown>
      | Resolver<unknown>
    )[]

    if (this.registrations[name] === undefined) {
      this.register(name, asArray(store))
    }
    store.unshift(registration)

    return this
  }.bind(container)

  return container
}
describe("modules loader", () => {
  let container

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    container = buildContainer()
  })

  it("registers service as undefined in container when no resolution path is given", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: false,
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
          resources: MODULE_RESOURCE_TYPE.SHARED,
        },
      },
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })
    await registerModules({ container, configModule, logger: Logger })

    const testService = container.resolve(
      moduleResolutions.testService.definition.key
    )
    expect(testService).toBe(undefined)
  })

  it("registers service ", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@modules/default",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
          resources: MODULE_RESOURCE_TYPE.SHARED,
        },
      },
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })

    await registerModules({ container, configModule, logger: Logger })

    const testService = container.resolve(
      moduleResolutions.testService.definition.key,
      {}
    )

    expect(trackInstallation).toHaveBeenCalledWith(
      {
        module: moduleResolutions.testService.definition.key,
        resolution: moduleResolutions.testService.resolutionPath,
      },
      "module"
    )
    expect(testService).toBeTruthy()
    expect(typeof testService).toEqual("object")
  })

  it("runs defined loaders and logs error", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@modules/brokenloader",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
          resources: MODULE_RESOURCE_TYPE.SHARED,
        },
      },
    }

    const logger: typeof Logger = {
      warn: jest.fn(),
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })

    await registerModules({ container, configModule, logger })

    expect(logger.warn).toHaveBeenCalledWith(
      "Could not resolve module: TestService. Error: Loaders for module TestService failed: loader"
    )
  })

  it("logs error if no service is defined", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@modules/no-service",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
          resources: MODULE_RESOURCE_TYPE.SHARED,
        },
      },
    }

    const logger: typeof Logger = {
      warn: jest.fn(),
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })

    await registerModules({ container, configModule, logger })

    expect(logger.warn).toHaveBeenCalledWith(
      "Could not resolve module: TestService. Error: No service found in module. Make sure that your module exports a service."
    )
  })

  it("throws error if no service is defined and module is required", async () => {
    expect.assertions(1)
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@modules/no-service",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          isRequired: true,
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
          resources: MODULE_RESOURCE_TYPE.SHARED,
        },
      },
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })
    try {
      await registerModules({ container, configModule, logger: Logger })
    } catch (err) {
      expect(err.message).toEqual(
        "No service found in module. Make sure that your module exports a service."
      )
    }
  })

  it("throws error if no scope is defined to the module", async () => {
    expect.assertions(1)
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@modules/no-service",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          isRequired: true,
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        // @ts-ignore
        moduleDeclaration: {
          resources: MODULE_RESOURCE_TYPE.SHARED,
        },
      },
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })
    try {
      await registerModules({ container, configModule, logger: Logger })
    } catch (err) {
      expect(err.message).toEqual(
        "The module TestService has to define its scope (internal | external)"
      )
    }
  })

  it("throws error if resources is not set when scope is defined as internal", async () => {
    expect.assertions(1)
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@modules/no-service",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          isRequired: true,
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
            resources: MODULE_RESOURCE_TYPE.SHARED,
          },
        },
        // @ts-ignore
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
    }

    const configModule = buildConfigModule({
      moduleResolutions,
    })
    try {
      await registerModules({ container, configModule, logger: Logger })
    } catch (err) {
      expect(err.message).toEqual(
        "The module TestService is missing its resources config"
      )
    }
  })
})
