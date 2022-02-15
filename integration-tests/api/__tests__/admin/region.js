const path = require("path")
const { Region } = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

describe("/admin/regions", () => {
  let medusaProcess
  let dbConnection
  const cwd = path.resolve(path.join(__dirname, "..", ".."))

  beforeAll(async () => {
    dbConnection = await initDb({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
  })

  describe("DELETE /admin/regions/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        medusaProcess = await setupServer({ cwd })

        const manager = dbConnection.manager
        await manager.insert(Region, {
          id: "test-region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        })

        await manager.query(
          `UPDATE "country" SET region_id='test-region' WHERE iso_2 = 'us'`
        )
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
      medusaProcess.kill()
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

      expect(response.data).toEqual({
        id: "test-region",
        object: "region",
        deleted: true,
      })
      expect(response.status).toEqual(200)
    })

    it("fails to create when countries exists in different region", async () => {
      const api = useApi()

      try {
        await api.post(
          `/admin/regions`,
          {
            name: "World",
            currency_code: "usd",
            tax_rate: 0,
            payment_providers: ["test-pay"],
            fulfillment_providers: ["test-ful"],
            countries: ["us"],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
      } catch (error) {
        expect(error.response.status).toEqual(402)
        expect(error.response.data.message).toEqual(
          "United States already exists in region test-region"
        )
      }
    })
  })
})
