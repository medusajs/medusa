import ProductImportStrategy from "@medusajs/medusa/dist/strategies/product-import"
import redisLoader from "@medusajs/medusa/dist/loaders/redis"

const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../helpers/use-db")
const { initRedis, useRedis } = require("../../../helpers/use-redis")
const { setPort, useApi } = require("../../../helpers/use-api")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("Product import strategy", () => {
  let appContainer
  let dbConnection
  let express

  let redisClient

  const doAfterEach = async () => {
    const db = useDb()
    const redis = useRedis()

    await redis.teardown()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      const configPath = path.resolve(path.join(cwd, `medusa-config.js`))
      const config = require(configPath)

      dbConnection = await initDb({ cwd })
      redisClient = await initRedis({ cwd })

      const { container, app, port } = await bootstrapApp({ cwd })

      config.projectConfig.redis_url = {
        host: redisClient.options.host,
        port: redisClient.options.port,
        db: redisClient.options.db,
      }

      await redisLoader({ container, configModule: config, logger: {} })
      appContainer = container

      setPort(port)
      express = app.listen(port, (err) => {
        process.send(port)
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    const redis = useRedis()
    await redis.shutdown()

    express.close()
    // medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("strategy test", async () => {
    const eventBus = appContainer.resolve("eventBusService")

    const productImportStrategy: ProductImportStrategy = appContainer.resolve(
      "batchType_product_import"
    )

    console.log(productImportStrategy)
  })
})
