const path = require("path")
const {} = require("@medusajs/medusa")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  default: startServerWithEnvironment,
} = require("../../../helpers/start-server-with-environment")

jest.setTimeout(30000)

describe("sales channels", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = startServerWithEnvironment({
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

  describe("GET /admin/sales-channels", () => {})
  describe("POST /admin/sales-channels", () => {})
  describe("GET /admin/sales-channels/:id", () => {})
  describe("POST /admin/sales-channels/:id", () => {})
  describe("DELETE /admin/sales-channels/:id", () => {})
})
