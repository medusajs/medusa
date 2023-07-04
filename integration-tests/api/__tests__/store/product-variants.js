const { ProductVariant } = require("@medusajs/medusa")
const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const { simpleProductFactory } = require("../../factories")

const productSeeder = require("../../helpers/product-seeder")
const storeProductSeeder = require("../../helpers/store-product-seeder")
jest.setTimeout(30000)
describe("/store/variants", () => {
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

  describe("GET /store/variants", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)

      await simpleProductFactory(
        dbConnection,
        {
          title: "prod",
          variants: [
            {
              title: "test1",
              inventory_quantity: 10,
            },
            {
              title: "test2",
              inventory_quantity: 12,
            },
          ],
        },
        100
      )
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("includes default relations", async () => {
      const api = useApi()

      const response = await api.get("/store/variants?ids=test-variant")

      expect(response.data).toMatchSnapshot({
        variants: [
          {
            allow_backorder: false,
            barcode: "test-barcode",
            created_at: expect.any(String),
            deleted_at: null,
            ean: "test-ean",
            height: null,
            hs_code: null,
            id: "test-variant",
            inventory_quantity: 10,
            length: null,
            manage_inventory: true,
            material: null,
            metadata: null,
            mid_code: null,
            origin_country: null,
            product_id: "test-product",
            sku: "test-sku",
            title: "Test variant",
            upc: "test-upc",
            updated_at: expect.any(String),
            weight: null,
            width: null,
            options: [
              {
                created_at: expect.any(String),
                updated_at: expect.any(String),
              },
            ],
            prices: [
              {
                created_at: expect.any(String),
                updated_at: expect.any(String),
                amount: 100,
                currency_code: "usd",
                deleted_at: null,
                id: "test-price",
                region_id: null,
                variant_id: "test-variant",
              },
            ],
            product: expect.any(Object),
          },
        ],
      })
    })

    it("/test-variant", async () => {
      const api = useApi()

      const response = await api.get("/store/variants/test-variant")

      expect(response.data).toMatchSnapshot({
        variant: {
          allow_backorder: false,
          barcode: "test-barcode",
          created_at: expect.any(String),
          deleted_at: null,
          ean: "test-ean",
          height: null,
          hs_code: null,
          id: "test-variant",
          inventory_quantity: 10,
          length: null,
          manage_inventory: true,
          material: null,
          metadata: null,
          mid_code: null,
          origin_country: null,
          product_id: "test-product",
          sku: "test-sku",
          title: "Test variant",
          upc: "test-upc",
          updated_at: expect.any(String),
          weight: null,
          width: null,
          options: [
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          prices: [
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
              amount: 100,
              currency_code: "usd",
              deleted_at: null,
              id: "test-price",
              region_id: null,
              min_quantity: null,
              max_quantity: null,
              price_list_id: null,
              variant_id: "test-variant",
            },
          ],
          product: expect.any(Object),
        },
      })
    })
  })

  describe("GET /store/variants advanced pricing", () => {
    beforeEach(async () => {
      await storeProductSeeder(dbConnection)

      await simpleProductFactory(
        dbConnection,
        {
          title: "prod",
          variants: [
            {
              title: "test1",
              inventory_quantity: 10,
            },
            {
              title: "test2",
              inventory_quantity: 12,
            },
          ],
        },
        100
      )
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("/test-variant with currency code", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/variants/test-variant?currency_code=usd"
      )

      expect(response.data).toMatchSnapshot({
        variant: {
          allow_backorder: false,
          barcode: "test-barcode",
          created_at: expect.any(String),
          deleted_at: null,
          ean: "test-ean",
          height: null,
          hs_code: null,
          id: "test-variant",
          inventory_quantity: 10,
          length: null,
          manage_inventory: true,
          material: null,
          metadata: null,
          mid_code: null,
          origin_country: null,
          product_id: "test-product",
          sku: "test-sku",
          title: "Test variant",
          upc: "test-upc",
          updated_at: expect.any(String),
          weight: null,
          width: null,
          options: [
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          prices: [
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
              amount: 100,
              currency_code: "usd",
              deleted_at: null,
              id: "test-price",
              region_id: null,
              min_quantity: null,
              max_quantity: null,
              price_list_id: null,
              variant_id: "test-variant",
            },
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
              amount: 80,
              currency_code: "usd",
              deleted_at: null,
              price_list_id: "pl",
              id: "test-price-discount",
              region_id: null,
              variant_id: "test-variant",
              price_list: {
                created_at: expect.any(String),
                updated_at: expect.any(String),
                id: "pl",
              },
            },
          ],
          product: expect.any(Object),
        },
      })
    })

    it("sets additional prices correctly when querying a variant", async () => {
      const api = useApi()

      const response = await api
        .get("/store/variants/test-variant?cart_id=test-cart")
        .catch((error) => console.log(error))

      expect(response.data).toMatchSnapshot({
        variant: {
          id: "test-variant",
          inventory_quantity: 10,
          title: "Test variant",
          sku: "test-sku",
          ean: "test-ean",
          upc: "test-upc",
          barcode: "test-barcode",
          product_id: "test-product",
          allow_backorder: false,
          created_at: expect.any(String),
          deleted_at: null,
          height: null,
          hs_code: null,
          length: null,
          manage_inventory: true,
          material: null,
          metadata: null,
          mid_code: null,
          origin_country: null,
          updated_at: expect.any(String),
          weight: null,
          width: null,
          options: [
            {
              id: "test-variant-option",
              value: "Default variant",
              option_id: "test-option",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            },
          ],
          original_price: 100,
          calculated_price: 80,
          prices: [
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
              amount: 100,
              currency_code: "usd",
              deleted_at: null,
              id: "test-price",
              region_id: null,
              variant_id: "test-variant",
            },
            {
              created_at: expect.any(String),
              updated_at: expect.any(String),
              amount: 80,
              currency_code: "usd",
              deleted_at: null,
              price_list_id: "pl",
              id: "test-price-discount",
              region_id: null,
              variant_id: "test-variant",
              price_list: {
                created_at: expect.any(String),
                updated_at: expect.any(String),
                id: "pl",
              },
            },
          ],
          product: expect.any(Object),
        },
      })
    })

    it("lists by title", async () => {
      const api = useApi()

      const response = await api
        .get(
          "/store/variants?title[]=test1&title[]=test2&inventory_quantity[gt]=10"
        )
        .catch((err) => console.log(err))

      expect(response.data).toMatchSnapshot({
        variants: [
          {
            id: expect.any(String),
            title: "test2",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            options: [
              {
                created_at: expect.any(String),
                updated_at: expect.any(String),
                id: expect.any(String),
                option_id: expect.any(String),
                variant_id: expect.any(String),
              },
            ],
            prices: [
              {
                id: expect.any(String),
                variant_id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
              },
            ],
            product: expect.any(Object),
            product_id: expect.any(String),
          },
        ],
      })
    })
  })
})
