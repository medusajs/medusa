import {
  asFunction,
  asValue,
  AwilixContainer,
  ClassOrFunctionReturning,
  createContainer,
  Resolver,
} from "awilix"
import { mkdirSync, rmSync, writeFileSync } from "fs"
import Logger from "../logger"
import { resolve } from "path"
import {
  ConfigModule,
  MedusaContainer,
  ModuleResolution,
} from "../../types/global"
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

  it("registers service as false in container when no resolution path is given", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: undefined,
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
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
    expect(testService).toBe(false)
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
})
