const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const adminSeeder = require("../../helpers/admin-seeder")
const productSeeder = require("../../helpers/product-seeder")

jest.setTimeout(50000)

describe("/admin/product-types", () => {
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

  describe("GET /admin/product-types", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
        await adminSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("returns a list of product types", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/product-types", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)

      const typeMatch = {
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }

      expect(res.data.product_types).toMatchSnapshot([
        typeMatch,
        typeMatch,
      ])
    })

    it("returns a list of product types matching free text search param", async () => {
      const api = useApi()

      const res = await api
        .get("/admin/product-types?q=test-type-new", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(res.status).toEqual(200)

      const typeMatch = {
        created_at: expect.any(String),
        updated_at: expect.any(String),
      }

      // The value of the type should match the search param
      expect(res.data.product_types.map((pt) => pt.value)).toEqual([
        "test-type-new"
      ])

      // Should only return one type as there is only one match to the search param
      expect(res.data.product_types).toMatchSnapshot([
        typeMatch
      ])
    })
  })
})
