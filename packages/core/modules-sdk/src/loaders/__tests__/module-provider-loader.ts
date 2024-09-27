import { createMedusaContainer } from "@medusajs/utils"
import { asFunction, Lifetime } from "awilix"
import { moduleProviderLoader } from "../module-provider-loader"

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
        id: "default",
        options: {},
      },
    ]

    await moduleProviderLoader({ container, providers: moduleProviders })

    const testService = container.resolve("testService")
    expect(testService).toBeTruthy()
    expect(testService.constructor.name).toEqual("TestService")
  })

  it("should fail to register the provider service", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/default-with-fail-validation",
        id: "default",
        options: {},
      },
    ]

    const err = await moduleProviderLoader({
      container,
      providers: moduleProviders,
    }).catch((e) => e)

    expect(err).toBeTruthy()
    expect(err.message).toBe("Wrong options")
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
        id: "default",
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

  it("should fail to register the provider service with custom register fn", async () => {
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
        resolve: "@providers/default-with-fail-validation",
        id: "default",
        options: {},
      },
    ]

    const err = await moduleProviderLoader({
      container,
      providers: moduleProviders,
      registerServiceFn: fn,
    }).catch((e) => e)

    expect(err).toBeTruthy()
    expect(err.message).toBe("Wrong options")
  })

  it("should log the errors if no service is defined", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/no-service",
        id: "default",
        options: {},
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "@providers/no-service doesn't seem to have a main service exported -- make sure your module has a default export of a service."
      )
    }
  })

  it("should throw if no default export is defined", async () => {
    const moduleProviders = [
      {
        resolve: "@providers/no-default",
        id: "default",
        options: {},
      },
    ]

    try {
      await moduleProviderLoader({ container, providers: moduleProviders })
    } catch (error) {
      expect(error.message).toBe(
        "@providers/no-default doesn't seem to have a main service exported -- make sure your module has a default export of a service."
      )
    }
  })
})
