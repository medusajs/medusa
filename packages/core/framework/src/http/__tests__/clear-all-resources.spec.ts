import {
  ContainerRegistrationKeys,
  createMedusaContainer,
  MedusaError,
} from "@medusajs/utils"
import express from "express"
import { resolve } from "path"
import supertest from "supertest"
import { configManager } from "../../config"
import { asValue } from "../../deps/awilix"
import { logger } from "../../logger"
import { config } from "../__fixtures__/mocks"
import { ApiLoader } from "../router"

jest.mock("../middlewares/ensure-publishable-api-key", () => ({
  ensurePublishableApiKeyMiddleware: (_req, _res, next) => next(),
}))

describe("ApiLoader.clearAllResources", () => {
  const rootDir = resolve(__dirname, "../__fixtures__/routers-hmr")

  const createApp = () => {
    configManager.loadConfig({ projectConfig: config, baseDir: rootDir })

    const app = express()
    const container = createMedusaContainer()
    container.register(ContainerRegistrationKeys.LOGGER, asValue(logger))
    container.register(
      ContainerRegistrationKeys.CONFIG_MODULE,
      asValue(configManager.config)
    )

    app.use((req, _res, next) => {
      ;(req as any).scope = container.createScope()
      next()
    })

    return { app, container }
  }

  it("should keep middlewares registered on the app while the API was loading", async () => {
    const { app, container } = createApp()

    const apiLoader = new ApiLoader({
      app,
      sourceDir: rootDir,
      container,
    })
    const loading = apiLoader.load()

    app.use((_req, res, next) => {
      res.setHeader("x-session", "true")
      next()
    })
    await loading

    apiLoader.clearAllResources()
    await apiLoader.load()

    const res = await supertest(app).get("/store/restricted").expect(200)

    expect(res.headers["x-session"]).toBe("true")
  })

  it("should handle errors from middlewares registered on the app before the API", async () => {
    const { app, container } = createApp()

    app.use("/store/restricted", (_req, _res, next) => {
      next(new MedusaError(MedusaError.Types.NOT_ALLOWED, "Session failed"))
    })

    const apiLoader = new ApiLoader({
      app,
      sourceDir: rootDir,
      container,
    })
    await apiLoader.load()

    const res = await supertest(app).get("/store/restricted").expect(400)

    expect(res.body).toEqual({
      type: MedusaError.Types.NOT_ALLOWED,
      message: "Session failed",
    })
  })

  it("should register the restricted fields middlewares again when reloading", async () => {
    const { app, container } = createApp()

    const apiLoader = new ApiLoader({
      app,
      sourceDir: rootDir,
      baseRestrictedFields: ["secret"],
      storeRelationsLimit: 5,
      container,
    })
    await apiLoader.load()

    apiLoader.clearAllResources()
    await apiLoader.load()

    const res = await supertest(app).get("/store/restricted").expect(200)

    expect(res.body).toEqual({
      allowed: [],
      restrictedFields: ["secret"],
      storeRelationsLimit: 5,
    })
  })
})
