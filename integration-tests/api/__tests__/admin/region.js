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
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("Remove region from country on delete", () => {
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

    it("successfully creates a region with countries from a previously deleted region", async () => {
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
        countries: [
          {
            region_id: expect.any(String),
          },
        ],
        tax_rate: 0,
        fulfillment_providers: [
          {
            id: "test-ful",
            is_installed: true,
          },
        ],
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })
  })

  describe("GET /admin/regions", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await adminSeeder(dbConnection)
      await manager.insert(Region, {
        id: "test-region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
      await manager.insert(Region, {
        id: "test-region-deleted",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
        deleted_at: new Date(),
      })
      await manager.insert(Region, {
        id: "test-region-updated",
        name: "Test Region updated",
        currency_code: "usd",
        tax_rate: 0,
        updated_at: new Date(),
      })
      await manager.insert(Region, {
        id: "test-region-updated-1",
        name: "Test Region updated 1",
        currency_code: "usd",
        tax_rate: 0,
        updated_at: new Date("10/10/2000"),
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("only returns non-deleted regions", async () => {
      const api = useApi()

      const response = await api
        .get(`/admin/regions`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.regions).toEqual([
        expect.objectContaining({
          id: "test-region-updated-1",
        }),
        expect.objectContaining({
          id: "test-region",
        }),
        expect.objectContaining({
          id: "test-region-updated",
        }),
      ])
      expect(response.status).toEqual(200)
    })

    it("filters correctly on update", async () => {
      const api = useApi()

      const response = await api
        .get(`/admin/regions?updated_at[gt]=10-10-2005`, {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.data.regions).toEqual([
        expect.objectContaining({
          id: "test-region",
        }),
        expect.objectContaining({
          id: "test-region-updated",
        }),
      ])
      expect(response.status).toEqual(200)
    })
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
        expect(error.response.status).toEqual(422)
        expect(error.response.data.message).toEqual(
          "United States already exists in region test-region"
        )
      }
    })
  })
})
