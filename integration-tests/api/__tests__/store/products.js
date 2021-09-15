const { Product } = require("@medusajs/medusa")
const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")
const adminSeeder = require("../../helpers/admin-seeder")
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

    it("includes default relations", async () => {
      const api = useApi()

      const response = await api.get("/store/products/test-product")

      expect(response.data).toMatchSnapshot({
        product: {
          id: "test-product",
          variants: [
            {
              id: "test-variant",
              inventory_quantity: 10,
              allow_backorder: false,
              title: "Test variant",
              sku: "test-sku",
              ean: "test-ean",
              upc: "test-upc",
              length: null,
              manage_inventory: true,
              material: null,
              metadata: null,
              mid_code: null,
              height: null,
              hs_code: null,
              origin_country: null,
              barcode: "test-barcode",
              product_id: "test-product",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              prices: [
                {
                  id: "test-money-amount",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  amount: 100,
                  created_at: expect.any(String),
                  currency_code: "usd",
                  deleted_at: null,
                  id: "test-price",
                  region_id: null,
                  sale_amount: null,
                  updated_at: expect.any(String),
                  variant_id: "test-variant",
                },
              ],
            },
            {
              id: "test-variant_2",
              inventory_quantity: 10,
              allow_backorder: false,
              title: "Test variant rank (2)",
              sku: "test-sku2",
              ean: "test-ean2",
              upc: "test-upc2",
              length: null,
              manage_inventory: true,
              material: null,
              metadata: null,
              mid_code: null,
              height: null,
              hs_code: null,
              origin_country: null,
              barcode: null,
              product_id: "test-product",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              prices: [
                {
                  id: "test-money-amount",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  amount: 100,
                  created_at: expect.any(String),
                  currency_code: "usd",
                  deleted_at: null,
                  id: "test-price2",
                  region_id: null,
                  sale_amount: null,
                  updated_at: expect.any(String),
                  variant_id: "test-variant_2",
                },
              ],
            },
            {
              id: "test-variant_1",
              inventory_quantity: 10,
              allow_backorder: false,
              title: "Test variant rank (1)",
              sku: "test-sku1",
              ean: "test-ean1",
              upc: "test-upc1",
              length: null,
              manage_inventory: true,
              material: null,
              metadata: null,
              mid_code: null,
              height: null,
              hs_code: null,
              origin_country: null,
              barcode: "test-barcode 1",
              product_id: "test-product",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              prices: [
                {
                  id: "test-money-amount",
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                  amount: 100,
                  created_at: expect.any(String),
                  currency_code: "usd",
                  deleted_at: null,
                  id: "test-price1",
                  region_id: null,
                  sale_amount: null,
                  updated_at: expect.any(String),
                  variant_id: "test-variant_1",
                },
              ],
            },
          ],
          images: [
            {
              id: "test-image",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          handle: "test-product",
          title: "Test product",
          profile_id: expect.stringMatching(/^sp_*/),
          description: "test-product-description",
          collection_id: "test-collection",
          collection: {
            id: "test-collection",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          type: {
            id: "test-type",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
          tags: [
            {
              id: "tag1",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          options: [
            {
              id: "test-option",
              values: [
                {
                  id: "test-variant-option",
                  value: "Default variant",
                  option_id: "test-option",
                  variant_id: "test-variant",
                  metadata: null,
                  deleted_at: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
                {
                  id: "test-variant-option-1",
                  value: "Default variant 1",
                  option_id: "test-option",
                  variant_id: "test-variant_1",
                  metadata: null,
                  deleted_at: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
                {
                  id: "test-variant-option-2",
                  value: "Default variant 2",
                  option_id: "test-option",
                  variant_id: "test-variant_2",
                  metadata: null,
                  deleted_at: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
                {
                  id: "test-variant-option-3",
                  value: "Default variant 3",
                  option_id: "test-option",
                  variant_id: "test-variant_3",
                  metadata: null,
                  deleted_at: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
                {
                  id: "test-variant-option-4",
                  value: "Default variant 4",
                  option_id: "test-option",
                  variant_id: "test-variant_4",
                  metadata: null,
                  deleted_at: null,
                  created_at: expect.any(String),
                  updated_at: expect.any(String),
                },
              ],
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
      })
    })

    it("Fetching variant options without additional relation fails", async () => {
      const api = useApi()

      const response = await api.get("/store/products/test-product")

      const product = response.data.product

      expect(product.variants.some((variant) => variant.options)).toEqual(false)
    })

    it("lists all published products", async () => {
      const api = useApi()

      //update test-product status to published
      await api
        .post(
          "/admin/products/test-product",
          {
            status: "published",
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const response = await api.get("/store/products")

      expect(response.status).toEqual(200)
      expect(response.data.products).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-product",
            status: "published",
          }),
        ])
      )
    })
  })
})
