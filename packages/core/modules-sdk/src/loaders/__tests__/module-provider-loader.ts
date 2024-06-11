import { createMedusaContainer } from "@medusajs/utils"
import { Lifetime, asFunction } from "awilix"
import { moduleProviderLoader } from "../module-provider-loader"

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

  it("should register the provider service", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/default",
        options: {
          config: {
            test: "test",
          },
        },
      },
    ]

    await moduleProviderLoader({ container, providers: moduleProviders })

    const testService = container.resolve("test_test")
    expect(testService).toBeTruthy()
    expect(testService.constructor.name).toEqual("TestService")
  })

  it("should register the provider service with a prefix", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/default",
        options: {
          config: {
            test: "test",
          },
        },
      },
    ]

    await moduleProviderLoader({
      container,
      providers: moduleProviders,
      options: { registrationPrefix: "ts_" },
    })

    const testService = container.resolve("ts_test_test")
    expect(testService).toBeTruthy()
    expect(testService.constructor.name).toEqual("TestService")
  })

  it("should register the provider service with custom register fn", async () => {
    const fn = async (klass, container, details) => {
      container.register({
        [`testServiceCustomRegistration`]: asFunction(
          (cradle) => new klass(cradle, details.options),
          {
            lifetime: Lifetime.SINGLETON,
          }
        ),
      })
    }
    const moduleProviders = [
      {
        resolve: "@providers/default",
        options: {
          config: {
            test: "test",
          },
        },
      },
    ]

    await moduleProviderLoader({
      container,
      providers: moduleProviders,
      registerServiceFn: fn,
    })

    const testService = container.resolve("testServiceCustomRegistration")
    expect(testService).toBeTruthy()
    expect(testService.constructor.name).toEqual("TestService")
  })

  it("should throw if no identifier is present on the provider service", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/no-identifier",
        options: {
          config: {
            test: "test",
          },
        },
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "The provider Function is missing an identifier"
      )
    }
  })

  it("should log the errors if no service is defined", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/no-service",
        options: {
          config: {
            test: "test",
          },
        },
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "@providers/no-service doesn't seem to have a main service exported -- make sure your provider package has a default export of a service."
      )
    }
  })

  it("should throw if no default export is defined", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/no-default",
        options: {
          config: {
            test: "test",
          },
        },
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "@providers/no-default doesn't seem to have a main service exported -- make sure your provider package has a default export of a service."
      )
    }
  })
})
