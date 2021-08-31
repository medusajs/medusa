const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")

jest.setTimeout(30000)

describe("/store/products", () => {
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

  describe("/store/products/:id", () => {
    beforeEach(async () => {
      try {
        await productSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("simple product", async () => {
      const api = useApi()

      const response = await api
        .get("/store/products/test-product")
        .catch((err) => {
          console.log(err.response.data.message)
        })

      expect(response.data).toMatchSnapshot({
        product: {
          id: "test-product",
          variants: [
            {
              id: "test-variant",
              inventory_quantity: 10,
              title: "Test variant",
              sku: "test-sku",
              ean: "test-ean",
              upc: "test-upc",
              barcode: "test-barcode",
              product_id: "test-product",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              product: {
                profile_id: expect.stringMatching(/^sp_*/),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              },
              prices: [
                {
                  id: "test-price",
                  currency_code: "usd",
                  amount: 100,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
            },
          ],
          handle: "test-product",
          title: "Test product",
          profile_id: expect.stringMatching(/^sp_*/),
          description: "test-product-description",
          collection_id: "test-collection",
          type: {
            id: "test-type",
            value: "test-type",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          tags: [
            {
              id: "tag1",
              value: "123",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
            {
              tag: "tag2",
              value: "456",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          options: [
            {
              id: "test-option",
              title: "Default value",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })
  })
})
