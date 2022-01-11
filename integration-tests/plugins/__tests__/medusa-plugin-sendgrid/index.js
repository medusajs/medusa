const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleOrderFactory,
  simpleShippingOptionFactory,
  simpleProductFactory,
} = require("../../factories")

describe("medusa-plugin-sendgrid", () => {
  let container
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    try {
      dbConnection = await initDb({ cwd })
      const medusaApp = await bootstrapApp()
      container = medusaApp.container
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    // medusaProcess.kill()
  })

  afterEach(async () => {
    return await doAfterEach()
  })

  test("has sendgrid service", () => {
    console.log(container)
    console.log(container.resolve("sendGridService"))
  })
})
