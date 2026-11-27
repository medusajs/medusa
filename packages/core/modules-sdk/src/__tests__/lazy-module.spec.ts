import { asValue } from "@medusajs/deps/awilix"
import {
  createMedusaContainer,
  DeferredLoadError,
  resetDeferredLoadLog,
  setBuildManifest,
  setDeferredLoadLogger,
} from "@medusajs/utils"
import { MedusaModule } from "../medusa-module"
import { MODULE_SCOPE } from "../types"

const mockModuleLoader = jest.fn()

jest.mock("../loaders", () => ({
  registerMedusaModule: jest.fn().mockImplementation(() => ({
    lazyKey: {
      definition: { key: "lazyKey", isQueryable: true },
      moduleDeclaration: { scope: "internal" },
    },
  })),
  moduleLoader: jest
    .fn()
    .mockImplementation((...args) => mockModuleLoader(...args)),
}))

describe("lazy modules from a build manifest", () => {
  const joinerConfig = { serviceName: "lazyKey", alias: [], schema: "" }

  const bootstrap = (container = createMedusaContainer()) =>
    MedusaModule.bootstrap<any>({
      moduleKey: "lazyKey",
      defaultPath: "@path",
      sharedContainer: container,
      declaration: {
        scope: MODULE_SCOPE.INTERNAL,
        resolve: "@path",
        options: {},
      } as any,
    })

  const realService = () => ({
    __joinerConfig: joinerConfig,
    __hooks: { onApplicationStart: jest.fn() },
    listThings: jest.fn().mockResolvedValue(["thing"]),
  })

  beforeEach(() => {
    MedusaModule.clearInstances()
    mockModuleLoader.mockReset()
    setDeferredLoadLogger({ error: jest.fn() })
    resetDeferredLoadLog()
  })

  afterEach(() => {
    setBuildManifest(undefined)
    setDeferredLoadLogger(console)
  })

  it("runs the module loader at boot when there is no manifest", async () => {
    mockModuleLoader.mockImplementation(({ container }) => {
      container.register({ lazyKey: asValue(realService()) })
    })

    await bootstrap()

    expect(mockModuleLoader).toHaveBeenCalledTimes(1)
  })

  it("registers a stand-in without running the module loader", async () => {
    setBuildManifest({ lazyModules: { lazyKey: { joinerConfig } } })
    const container = createMedusaContainer()

    const { lazyKey } = await bootstrap(container)

    expect(mockModuleLoader).not.toHaveBeenCalled()
    expect(container.resolve("lazyKey")).toBe(lazyKey)
    expect(lazyKey.__hooks).toBeUndefined()
    expect(lazyKey.__joinerConfig).toMatchObject({
      serviceName: "lazyKey",
      primaryKeys: ["id"],
    })
    expect(MedusaModule.getJoinerConfig("lazyKey")).toMatchObject({
      serviceName: "lazyKey",
    })
    expect(MedusaModule.getAllJoinerConfigs().length).toBe(1)
  })

  it("never looks like a promise", async () => {
    setBuildManifest({ lazyModules: { lazyKey: { joinerConfig } } })
    const { lazyKey } = await bootstrap()

    expect(lazyKey.then).toBeUndefined()
    expect(mockModuleLoader).not.toHaveBeenCalled()
  })

  it("loads on the first method call, once, and delegates", async () => {
    const service = realService()
    mockModuleLoader.mockImplementation(({ container }) => {
      container.register({ lazyKey: asValue(service) })
    })
    setBuildManifest({ lazyModules: { lazyKey: { joinerConfig } } })
    const { lazyKey } = await bootstrap()

    const [first, second] = await Promise.all([
      lazyKey.listThings(),
      lazyKey.listThings(),
    ])

    expect(first).toEqual(["thing"])
    expect(second).toEqual(["thing"])
    expect(mockModuleLoader).toHaveBeenCalledTimes(1)
    expect(service.listThings).toHaveBeenCalledTimes(2)
    // Once loaded, hooks come from the real service
    expect(lazyKey.__hooks).toBe(service.__hooks)
  })

  it("retries a failed first load and wraps the failure in a DeferredLoadError", async () => {
    const service = realService()
    const container = createMedusaContainer()
    // A failing loader leaves `undefined` registered under the module key
    mockModuleLoader
      .mockImplementationOnce(({ container }) => {
        container.register({ lazyKey: asValue(undefined) })
        return Promise.reject(new Error("db down"))
      })
      .mockImplementation(({ container }) => {
        container.register({ lazyKey: asValue(service) })
      })
    setBuildManifest({ lazyModules: { lazyKey: { joinerConfig } } })
    const { lazyKey } = await bootstrap(container)

    const err = await lazyKey.listThings().catch((e) => e)

    expect(DeferredLoadError.isDeferredLoadError(err)).toBe(true)
    expect(err.kind).toBe("module")
    expect(err.target).toBe("lazyKey")
    expect(err.cause.message).toBe("db down")
    // The stand-in is back in the container, not `undefined`
    expect(container.resolve("lazyKey")).toBe(lazyKey)

    await expect(lazyKey.listThings()).resolves.toEqual(["thing"])
    expect(mockModuleLoader).toHaveBeenCalledTimes(2)
  })
})
