const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const { simpleProductFactory } = require("../../factories")

const adminSeeder = require("../../helpers/admin-seeder")
const adminVariantsSeeder = require("../../helpers/admin-variants-seeder")
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
      try {
        await adminVariantsSeeder(dbConnection)
      } catch (err) {
        console.log(err)
      }
      await adminSeeder(dbConnection)
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

      expect(response.data).toMatchSnapshot({
        variants: [
          {
            id: "test-variant",
            original_price: 100,
            calculated_price: 80,
            calculated_price_type: "sale",
            original_price_incl_tax: null,
            calculated_price_incl_tax: null,
            original_tax: null,
            calculated_tax: null,
            options: expect.any(Array),
            prices: expect.any(Array),
            product: expect.any(Object),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
      })
    })

    it("selects prices based on the passed region id", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/variants?id=test-variant&region_id=reg-europe",
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      expect(response.data).toMatchSnapshot({
        variants: [
          {
            id: "test-variant",
            original_price: 100,
            calculated_price: 80,
            calculated_price_type: "sale",
            original_price_incl_tax: 100,
            calculated_price_incl_tax: 80,
            original_tax: 0,
            calculated_tax: 0,
            options: expect.any(Array),
            prices: expect.any(Array),
            product: expect.any(Object),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
      })
    })

    it("selects prices based on the passed region id and customer id", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/variants?id=test-variant&region_id=reg-europe&customer_id=test-customer",
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )

      expect(response.data).toMatchSnapshot({
        variants: [
          {
            id: "test-variant",
            original_price: 100,
            calculated_price: 40,
            calculated_price_type: "sale",
            original_price_incl_tax: 100,
            calculated_price_incl_tax: 40,
            original_tax: 0,
            calculated_tax: 0,
            prices: expect.any(Array),
            options: expect.any(Array),
            product: expect.any(Object),
            created_at: expect.any(String),
            updated_at: expect.any(String),
          },
        ],
      })
    })
  })
})
