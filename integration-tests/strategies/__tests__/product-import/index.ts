const Redis = require("ioredis")
import { GenericContainer } from "testcontainers"

const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../helpers/use-db")
const { setPort, useApi } = require("../../../helpers/use-api")

const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("Product import strategy", () => {
  let appContainer
  let dbConnection
  let express

  // TODO: only for testing now -> refactor to `useRedis`
  let redisContainer
  let redisClient

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      dbConnection = await initDb({ cwd })

      redisContainer = await new GenericContainer("redis")
        // exposes the internal Docker port to the host machine
        .withExposedPorts(6379)
        .start()

      redisClient = new Redis({
        host: redisContainer.getHost(),
        // retrieves the port on the host machine which maps
        // to the exposed port in the Docker container
        port: redisContainer.getMappedPort(6379),
      })

      const { container, app, port } = await bootstrapApp({ cwd })
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

    redisClient && (await redisClient.quit())
    redisContainer && (await redisContainer.stop())

    express.close()
    // medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("strategy test", async () => {
    const eventBus = appContainer.resolve("eventBusService")

    eventBus.console.log(eventBus, redisClient, redisContainer)

    // const productImportStrategy = appContainer.resolve("productImport")
  })
})
