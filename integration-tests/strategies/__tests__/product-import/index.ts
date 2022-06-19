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

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      dbConnection = await initDb({ cwd })
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
    express.close()
    // medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("strategy test", async () => {
    const eventBus = appContainer.resolve("eventBusService")

    const productImportStrategy = appContainer.resolve("productImportStrategy")
  })
})
