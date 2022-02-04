const path = require("path")
const { Region, FulfillmentProvider, Country } = require("@medusajs/medusa")

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
    medusaProcess = await setupServer({ cwd, verbose: true })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("DELETE /admin/regions/:id", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
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
  })

  describe("DELETE + POST /admin/regions", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
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
    })

    it("successfully create a region with countries from a previously deleted region", async () => {
      const api = useApi()

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
      expect(response.data).toMatchSnapshot({
        id: "test-region",
        object: "region",
        deleted: true,
      })

      const newReg = await api.post(
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

      expect(newReg.status).toEqual(200)
      expect(newReg.data.region).toMatchSnapshot({
        id: expect.any(String),
        name: "World",
        currency_code: "usd",
        tax_rate: 0,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })
})
