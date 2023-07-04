const { ProductCollection } = require("@medusajs/medusa")
const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")

jest.setTimeout(30000)
describe("/store/collections", () => {
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

  describe("/store/collections/:id", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("gets collection", async () => {
      const api = useApi()

      const response = await api.get("/store/collections/test-collection")

      expect(response.data).toMatchSnapshot({
        collection: {
          id: "test-collection",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })
  })

  describe("/store/collections", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists collections", async () => {
      const api = useApi()

      const response = await api.get("/store/collections")

      expect(response.data).toMatchSnapshot({
        collections: [
          {
            id: "test-collection2",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: "test-collection1",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          {
            id: "test-collection",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
        count: 3,
        limit: 10,
        offset: 0,
      })
    })
  })
})
