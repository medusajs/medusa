const path = require("path")
const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")
const adminSeeder = require("../../../helpers/admin-seeder")

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/products", () => {
  let medusaProcess
  let dataSource

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))

    dataSource = await initDb({ cwd })
    medusaProcess = await setupServer({
      cwd,
      env: {
        MEDUSA_FF_SALES_CHANNELS: false,
      }
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/products", () => {
    beforeEach(async () => {
      await adminSeeder(dataSource)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a product successfully", async () => {
      const api = useApi()

      const payload = {
        title: "Test",
        description: "test-product-description",
      }

      const response = await api
        .post("/admin/products", payload, adminHeaders)

      expect(response.status).toEqual(200)
      expect(response.data.product).toEqual(
        expect.objectContaining({
          id: expect.stringMatching(/^prod_*/),
          title: "Test",
          description: "test-product-description",
          handle: "test",
          status: "draft",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
    })
  })
})
