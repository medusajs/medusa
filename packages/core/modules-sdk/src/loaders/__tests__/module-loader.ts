import { asValue } from "@medusajs/deps/awilix"
import { ModuleResolution } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  Modules,
} from "@medusajs/utils"
import { MODULE_SCOPE } from "../../types"
import { moduleLoader } from "../module-loader"

// Stands in for the real provider, whose import is slow enough to time out on
// cold CI runners.
jest.mock("@medusajs/medusa/auth-oidc", () => ({
  services: [
    class OidcProviderService {
      static identifier = "oidc"
    },
  ],
}))

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
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
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
        resolutionPath: require.resolve("../__mocks__/@modules/default"),
        definition: {
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
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
        resolutionPath: require.resolve("../__mocks__/@modules/brokenloader"),
        definition: {
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
    }

    await expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow("Loaders for module TestService failed: loader")
  })

  it("should log the errors if no service is defined", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: require.resolve("../__mocks__/@modules/no-service"),
        definition: {
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
    }

    await expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow(
      "No service found in module TestService. Make sure your module exports a service."
    )
  })

  it("should throw an error if no service is defined and the module is required", async () => {
    const moduleResolutions: Record<string, ModuleResolution> = {
      testService: {
        resolutionPath: require.resolve("../__mocks__/@modules/no-service"),
        definition: {
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          isRequired: true,
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
    }

    await expect(
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
          key: "testService",
          defaultPackage: "@medusajs/testService",
          label: "TestService",
          isRequired: true,
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
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
          key: "testService",
          defaultPackage: "testService",
          label: "TestService",
          isRequired: true,
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        // @ts-ignore
        moduleDeclaration: {},
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
})

describe("license gated modules", () => {
  const moduleResolutions: Record<string, ModuleResolution> = {
    [Modules.RBAC]: {
      resolutionPath: require.resolve("../__mocks__/@modules/default"),
      definition: {
        key: Modules.RBAC,
        defaultPackage: "rbac",
        label: "RBAC",
        defaultModuleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
      },
    },
  }

  const registerLicense = (container, features: string[]): void => {
    container.register(
      ContainerRegistrationKeys.LICENSE,
      asValue({ token: "token", sub: "org_test", features })
    )
  }

  it("refuses to load a gated module when no license is registered", async () => {
    const container = createMedusaContainer()

    await expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow("is missing or could not be verified")
  })

  it("refuses to load a gated module the license does not cover", async () => {
    const container = createMedusaContainer()
    registerLicense(container, ["other-feature"])

    await expect(
      moduleLoader({ container, moduleResolutions, logger })
    ).rejects.toThrow('does not cover the "rbac" feature')
  })

  it("loads a gated module the license covers", async () => {
    const container = createMedusaContainer()
    registerLicense(container, ["rbac"])

    await moduleLoader({ container, moduleResolutions, logger })

    expect(container.resolve(Modules.RBAC)).toBeDefined()
  })

  describe("license gated providers", () => {
    const providerResolutions = (
      resolve: string
    ): Record<string, ModuleResolution> => ({
      [Modules.AUTH]: {
        resolutionPath: require.resolve("../__mocks__/@modules/default"),
        definition: {
          key: Modules.AUTH,
          defaultPackage: "auth",
          label: "Auth",
          defaultModuleDeclaration: {
            scope: MODULE_SCOPE.INTERNAL,
          },
        },
        moduleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
        options: {
          providers: [{ resolve, id: "oidc" }],
        },
      },
    })

    it.each(["@medusajs/auth-oidc", "@medusajs/medusa/auth-oidc"])(
      "refuses to load a module with the %s provider when no license is registered",
      async (resolve) => {
        const container = createMedusaContainer()

        await expect(
          moduleLoader({
            container,
            moduleResolutions: providerResolutions(resolve),
            logger,
          })
        ).rejects.toThrow("is missing or could not be verified")
      }
    )

    it("refuses to load a gated provider the license does not cover", async () => {
      const container = createMedusaContainer()
      registerLicense(container, ["rbac"])

      await expect(
        moduleLoader({
          container,
          moduleResolutions: providerResolutions("@medusajs/medusa/auth-oidc"),
          logger,
        })
      ).rejects.toThrow('does not cover the "auth-oidc" feature')
    })

    it("does not gate a gated provider the license covers", async () => {
      const container = createMedusaContainer()
      registerLicense(container, ["auth-oidc"])

      await moduleLoader({
        container,
        moduleResolutions: providerResolutions("@medusajs/medusa/auth-oidc"),
        logger,
      })

      expect(container.resolve(Modules.AUTH)).toBeDefined()
    })
  })
})
