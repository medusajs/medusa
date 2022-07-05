const path = require("path")

const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const salesChannelsSeeder = require("../../helpers/sales-channels-seeder")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(30000)

describe("sales channels", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    process.env.MEDUSA_FF_SALES_CHANNELS = true
    const [procesTet, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_SALES_CHANNELS: true },
    })
    dbConnection = connection
    medusaProcess = procesTet
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

  describe("GET /admin/sales-channels/:id", () => {
    beforeEach(async() => {
      try {
        await adminSeeder(dbConnection)
        await salesChannelsSeeder(dbConnection)
      } catch (e) {
        console.error(e)
      }
    })

    afterEach(async() => {
      const db = useDb()
      await db.teardown()
    })

    it("should retrieve the requested sales channel", async() => {
      const api = useApi()
      const response = await api.get(
        "/admin/sales-channels/sales_channel_1",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.sales_channel).toBeTruthy()
      expect(response.data).toMatchSnapshot({
        sales_channel: expect.objectContaining({
          id: "sales_channel_1",
          name: "sales channel 1 name",
          description: "sales channel 1 description",
          is_disabled: false
        })
      })
    })
  })

  describe("POST /admin/sales-channels/:id", () => {})
  describe("DELETE /admin/sales-channels/:id", () => {})
})
