const path = require("path")
const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const productSeeder = require("../../helpers/product-seeder")
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
              sale_amount: null,
              variant_id: "test-variant",
            },
          ],
          product: expect.any(Object),
          options: [
            { created_at: expect.any(String), updated_at: expect.any(String) },
          ],
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
            sale_amount: null,
            variant_id: "test-variant",
          },
        ],
        product: expect.any(Object),
        options: [
          { created_at: expect.any(String), updated_at: expect.any(String) },
        ],
      },
    })
  })
})
