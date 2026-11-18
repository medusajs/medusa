import {
  ContainerRegistrationKeys,
  createMedusaContainer,
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
  afterEach(() => {
    delete (global as any).__MEDUSA_HMR_INITIAL_STACK_LENGTH__
  })

  it("should register the restricted fields middlewares again when reloading", async () => {
    const rootDir = resolve(__dirname, "../__fixtures__/routers-hmr")
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
    ;(global as any).__MEDUSA_HMR_INITIAL_STACK_LENGTH__ = (
      app as any
    )._router.stack.length

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
