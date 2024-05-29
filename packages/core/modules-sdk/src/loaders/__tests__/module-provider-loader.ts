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
        resolve: "@modules/default",
        options: {},
      },
    ]

    await moduleProviderLoader({ container, providers: moduleProviders })

    const testService = container.resolve("testService")
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
        resolve: "@modules/default",
        options: {},
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

  it("should log the errors if no service is defined", async () => {
    const moduleProviders = [
      {
        resolve: "@modules/no-service",
        options: {},
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "@modules/no-service doesn't seem to have a main service exported -- make sure your module has a default export of a service."
      )
    }
  })

  it("should throw if no default export is defined", async () => {
    const moduleProviders = [
      {
        resolve: "@modules/no-default",
        options: {},
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "@modules/no-default doesn't seem to have a main service exported -- make sure your module has a default export of a service."
      )
    }
  })
})
