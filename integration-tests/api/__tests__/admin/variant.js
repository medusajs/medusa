const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const { simpleProductFactory } = require("../../factories")

const adminSeeder = require("../../helpers/admin-seeder")
const productSeeder = require("../../helpers/product-seeder")
const storeProductSeeder = require("../../helpers/store-product-seeder")

jest.setTimeout(30000)

describe("/admin/products", () => {
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

  describe("GET /admin/product-variants", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists all product variants", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/variants/", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining(
            {
              id: "test-variant",
            },
            {
              id: "test-variant_2",
            },
            {
              id: "test-variant_1",
            }
          ),
        ])
      )
    })

    it("lists all product variants matching a specific sku", async () => {
      const api = useApi()
      const response = await api
        .get("/admin/variants?q=sku2", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.variants.length).toEqual(1)
      expect(response.data.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sku: "test-sku2",
          }),
        ])
      )
    })

    it("lists all product variants matching a specific variant title", async () => {
      const api = useApi()
      const response = await api
        .get("/admin/variants?q=rank (1)", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.variants.length).toEqual(1)
      expect(response.data.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-variant_1",
            sku: "test-sku1",
          }),
        ])
      )
    })

    it("lists all product variants matching a specific product title", async () => {
      const api = useApi()
      const response = await api
        .get("/admin/variants?q=Test product1", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data.variants.length).toEqual(2)
      expect(response.data.variants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            product_id: "test-product1",
            id: "test-variant_3",
            sku: "test-sku3",
          }),
          expect.objectContaining({
            product_id: "test-product1",
            id: "test-variant_4",
            sku: "test-sku4",
          }),
        ])
      )
    })
  })

  describe("GET /admin/variants price selection strategy", () => {
    beforeEach(async () => {
      await storeProductSeeder(dbConnection)
      await adminSeeder(dbConnection)

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

    it("selects prices based on the passed currency code", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/variants?id=test-variant&currency_code=usd",
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      console.warn("response", response.data.variants)

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
            original_price: 100,
            calculated_price: 80,
            calculated_price_type: "sale",
            original_price_incl_tax: null,
            calculated_price_incl_tax: null,
            original_tax: null,
            calculated_tax: null,
            tax_rates: null,
          },
        ],
      })
    })
  })
})
