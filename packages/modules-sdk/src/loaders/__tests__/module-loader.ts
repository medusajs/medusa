import {
  ModuleResolution,
  MODULE_RESOURCE_TYPE,
  MODULE_SCOPE,
} from "@medusajs/types"
import { AwilixContainer, ClassOrFunctionReturning, Resolver } from "awilix"
import { createMedusaContainer } from "medusa-core-utils"
import { EOL } from "os"
import { moduleLoader } from "../module-loader"
import { trackInstallation } from "../__mocks__/medusa-telemetry"

function asArray(
  resolvers: (ClassOrFunctionReturning<unknown> | Resolver<unknown>)[]
): { resolve: (container: AwilixContainer) => unknown[] } {
  return {
    resolve: (container: AwilixContainer): unknown[] =>
      resolvers.map((resolver) => container.build(resolver)),
  }
}

const logger = {
  warn: jest.fn(),
  error: jest.fn(),
} as any

describe("modules loader", () => {
  let container

  afterEach(() => {
    jest.clearAllMocks()
  })

  beforeEach(() => {
    container = createMedusaContainer()
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

    await moduleLoader({ container, moduleResolutions, logger })

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

    await moduleLoader({ container, moduleResolutions, logger })

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

    await moduleLoader({ container, moduleResolutions, logger })

    expect(logger.warn).toHaveBeenCalledWith(
      `Could not resolve module: TestService. Error: Loaders for module TestService failed: loader${EOL}`
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

    await moduleLoader({ container, moduleResolutions, logger })

    expect(logger.warn).toHaveBeenCalledWith(
      `Could not resolve module: TestService. Error: No service found in module. Make sure your module exports a service.${EOL}`
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

    try {
      await moduleLoader({ container, moduleResolutions, logger })
    } catch (err) {
      expect(err.message).toEqual(
        "No service found in module. Make sure your module exports a service."
      )
    }
  })

  it("throws error if default package isn't found and module is required", async () => {
    expect.assertions(1)
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: "@medusajs/testService",
        definition: {
          registrationName: "testService",
          key: "testService",
          defaultPackage: "@medusajs/testService",
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

    try {
      await moduleLoader({ container, moduleResolutions, logger })
    } catch (err) {
      expect(err.message).toEqual(
        `Make sure you have installed the default package: @medusajs/testService`
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

    try {
      await moduleLoader({ container, moduleResolutions, logger })
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
      } as any,
    }

    try {
      await moduleLoader({ container, moduleResolutions, logger })
    } catch (err) {
      expect(err.message).toEqual(
        "The module TestService is missing its resources config"
      )
    }
  })
})
