import { ModuleResolution } from "@medusajs/types"
import { createMedusaContainer } from "@medusajs/utils"
import { MODULE_RESOURCE_TYPE, MODULE_SCOPE } from "../../types"
import { moduleLoader } from "../module-loader"

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

  it("should register the service as undefined in the container when no resolution path is given", async () => {
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

  it("should register the service ", async () => {
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

    /*
    expect(trackInstallation).toHaveBeenCalledWith(
      {
        module: moduleResolutions.testService.definition.key,
        resolution: moduleResolutions.testService.resolutionPath,
      },
      "module"
    )
    */
    expect(testService).toBeTruthy()
    expect(typeof testService).toEqual("object")
  })

  it("should run the defined loaders and logs the errors if something fails", async () => {
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

    expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow("Loaders for module TestService failed: loader")
  })

  it("should log the errors if no service is defined", async () => {
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

    expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow(
      "No service found in module TestService. Make sure your module exports a service."
    )
  })

  it("should throw an error if no service is defined and the module is required", async () => {
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

    expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow(
      "No service found in module TestService. Make sure your module exports a service."
    )
  })

  it("should throw an error if the default package isn't found and the module is required", async () => {
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

  it("should throw an error if no scope is defined on the module declaration", async () => {
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

  it("should throw an error if the resources is not set when scope is defined as internal", async () => {
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
