const path = require("path")
const { Region, FulfillmentProvider } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/discounts", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("DELETE /admin/regions/:id", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)
      await manager.insert(Region, {
        id: "test-region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully deletes a region with a fulfillment provider", async () => {
      const api = useApi()

      // add fulfillment provider to the region
      await api.post(
        "/admin/regions/test-region",
        {
          fulfillment_providers: ["test-ful"],
        },
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      const response = await api
        .delete(`/admin/regions/test-region`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
    })
  })
})
