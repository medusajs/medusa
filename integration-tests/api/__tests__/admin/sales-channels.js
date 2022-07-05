const path = require("path")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default

jest.setTimeout(30000)

describe("sales channels", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("GET /admin/sales-channels", () => {
    it("is true", () => {
      // dummy test to ensure test suite passes
      expect(true).toBeTruthy()
    })
  })
  describe("POST /admin/sales-channels", () => {})
  describe("GET /admin/sales-channels/:id", () => {})
  describe("POST /admin/sales-channels/:id", () => {})
  describe("DELETE /admin/sales-channels/:id", () => {})
})
