import { ModuleResolution } from "@medusajs/types"
import {
  createMedusaContainer,
  getRegisteredLicensedFeatures,
  resetLicenseState,
} from "@medusajs/utils"
import { MODULE_SCOPE } from "../../types"
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
  const setLicenseEnv = (features: string[]): void => {
    const { generateKeyPairSync, sign } = require("crypto")
    const { publicKey, privateKey } = generateKeyPairSync("ed25519")

    const toSegment = (value: object): string =>
      Buffer.from(JSON.stringify(value), "utf-8").toString("base64url")

    const headerSegment = toSegment({ alg: "EdDSA", kid: "test-key" })
    const payloadSegment = toSegment({
      sub: "org_test",
      jti: "lic_test",
      features,
      iat: Math.floor(Date.now() / 1000),
    })
    const signature = sign(
      null,
      Buffer.from(`${headerSegment}.${payloadSegment}`, "utf-8"),
      privateKey
    ).toString("base64url")

    process.env.MEDUSA_LICENSE_KEY = `${headerSegment}.${payloadSegment}.${signature}`
    process.env.MEDUSA_LICENSE_PUBLIC_KEY = publicKey
      .export({ type: "spki", format: "pem" })
      .toString()

    resetLicenseState()
  }

  const buildResolutions = (): Record<string, ModuleResolution> => ({
    licensedService: {
      resolutionPath: require.resolve("../__mocks__/@modules/licensed"),
      definition: {
        key: "licensedService",
        defaultPackage: "licensedService",
        label: "LicensedService",
        defaultModuleDeclaration: {
          scope: MODULE_SCOPE.INTERNAL,
        },
      },
      moduleDeclaration: {
        scope: MODULE_SCOPE.INTERNAL,
      },
    },
  })

  afterEach(() => {
    delete process.env.MEDUSA_LICENSE_KEY
    delete process.env.MEDUSA_LICENSE_PUBLIC_KEY

    resetLicenseState()
  })

  it("refuses to load a module declaring a licensed feature without a license key", async () => {
    expect.assertions(1)
    const container = createMedusaContainer()

    try {
      await moduleLoader({
        container,
        moduleResolutions: buildResolutions(),
        logger,
      })
    } catch (err) {
      expect(err.message).toContain("requires a Medusa license key")
    }
  })

  it("refuses to load a module whose licensed feature the key does not cover", async () => {
    expect.assertions(1)
    setLicenseEnv(["other-feature"])
    const container = createMedusaContainer()

    try {
      await moduleLoader({
        container,
        moduleResolutions: buildResolutions(),
        logger,
      })
    } catch (err) {
      expect(err.message).toContain('does not cover the "test-feature" feature')
    }
  })

  it("loads a module whose licensed feature the key covers, and records the feature", async () => {
    setLicenseEnv(["test-feature"])
    const container = createMedusaContainer()

    await moduleLoader({
      container,
      moduleResolutions: buildResolutions(),
      logger,
    })

    expect(container.resolve("licensedService")).toBeDefined()
    expect(getRegisteredLicensedFeatures()).toEqual(["test-feature"])
  })
})
