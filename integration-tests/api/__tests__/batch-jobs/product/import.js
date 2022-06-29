const path = require("path")

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const batchJobSeeder = require("../../../helpers/batch-job-seeder")
const userSeeder = require("../../../helpers/user-seeder")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(1000000)

describe("Product import batch job", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })

    medusaProcess = await setupServer({
      cwd,
      redisUrl: "redis://127.0.0.1:6379",
      uploadDir: __dirname,
      verbose: true,
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    try {
      await batchJobSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await userSeeder(dbConnection)
    } catch (e) {
      console.log(e)
      throw e
    }
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should import a csv file", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "product_import",
        context: {
          fileKey: "product-import.csv",
        },
      },
      adminReqConfig
    )

    const batchJobId = response.data.batch_job.id

    expect(batchJobId).toBeTruthy()

    // Pull to check the status until it is completed
    let batchJob
    let shouldContinuePulling = true
    while (shouldContinuePulling) {
      const res = await api.get(
        `/admin/batch-jobs/${batchJobId}`,
        adminReqConfig
      )

      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000)
      })

      batchJob = res.data.batch_job

      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("completed")

    const productsResponse = await api.get("/admin/products", adminReqConfig)

    expect(productsResponse.data.count).toBe(2)
    expect(productsResponse.data.products).toEqual([
      {
        id: "O6S1YQ6mKm",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        title: "Test product",
        subtitle: null,
        description: "test-product-description-1",
        handle: "test-product-product-1",
        is_giftcard: false,
        status: "draft",
        thumbnail: "test-image.png",
        profile_id: expect.any(String),
        weight: null,
        length: null,
        height: null,
        width: null,
        hs_code: null,
        origin_country: null,
        mid_code: null,
        material: null,
        collection_id: null,
        type_id: null,
        discountable: true,
        external_id: null,
        metadata: null,
        variants: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            title: "Test variant",
            product_id: "O6S1YQ6mKm",
            sku: "test-sku-1",
            barcode: "test-barcode-1",
            ean: null,
            upc: null,
            inventory_quantity: 10,
            allow_backorder: false,
            manage_inventory: true,
            hs_code: null,
            origin_country: null,
            mid_code: null,
            material: null,
            weight: null,
            length: null,
            height: null,
            width: null,
            metadata: null,
            prices: [
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                currency_code: "eur",
                amount: 100,
                min_quantity: null,
                max_quantity: null,
                price_list_id: null,
                variant_id: expect.any(String),
                region_id: "region-product-import-0",
                price_list: null,
              },
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                currency_code: "usd",
                amount: 110,
                min_quantity: null,
                max_quantity: null,
                price_list_id: null,
                variant_id: expect.any(String),
                region_id: null,
                price_list: null,
              },
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                currency_code: "dkk",
                amount: 130,
                min_quantity: null,
                max_quantity: null,
                price_list_id: null,
                variant_id: expect.any(String),
                region_id: "region-product-import-1",
                price_list: null,
              },
            ],
            options: [
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                value: "option 1 value red",
                option_id: expect.any(String),
                variant_id: expect.any(String),
                metadata: null,
              },
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                value: "option 2 value 1",
                option_id: expect.any(String),
                variant_id: expect.any(String),
                metadata: null,
              },
            ],
            original_price: null,
            calculated_price: null,
            original_price_incl_tax: null,
            calculated_price_incl_tax: null,
            original_tax: null,
            calculated_tax: null,
            tax_rates: null,
          },
        ],
        images: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            url: "test-image.png",
            metadata: null,
          },
        ],
        options: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            title: "test-option-1",
            product_id: "O6S1YQ6mKm",
            metadata: null,
          },
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            title: "test-option-2",
            product_id: "O6S1YQ6mKm",
            metadata: null,
          },
        ],
        tags: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            value: "123_1",
            metadata: null,
          },
        ],
        type: null,
        collection: null,
      },
      {
        id: "5VxiEkmnPV",
        created_at: expect.any(String),
        updated_at: expect.any(String),
        deleted_at: null,
        title: "Test product",
        subtitle: null,
        description: "test-product-description",
        handle: "test-product-product-2",
        is_giftcard: false,
        status: "draft",
        thumbnail: "test-image.png",
        profile_id: expect.any(String),
        weight: null,
        length: null,
        height: null,
        width: null,
        hs_code: null,
        origin_country: null,
        mid_code: null,
        material: null,
        collection_id: null,
        type_id: null,
        discountable: true,
        external_id: null,
        metadata: null,
        variants: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            title: "Test variant",
            product_id: "5VxiEkmnPV",
            sku: "test-sku-2",
            barcode: "test-barcode-2",
            ean: null,
            upc: null,
            inventory_quantity: 10,
            allow_backorder: false,
            manage_inventory: true,
            hs_code: null,
            origin_country: null,
            mid_code: null,
            material: null,
            weight: null,
            length: null,
            height: null,
            width: null,
            metadata: null,
            prices: [
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                currency_code: "dkk",
                amount: 110,
                min_quantity: null,
                max_quantity: null,
                price_list_id: null,
                variant_id: expect.any(String),
                region_id: "region-product-import-2",
                price_list: null,
              },
            ],
            options: [
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                value: "Option 1 value 1",
                option_id: expect.any(String),
                variant_id: expect.any(String),
                metadata: null,
              },
            ],
            original_price: null,
            calculated_price: null,
            original_price_incl_tax: null,
            calculated_price_incl_tax: null,
            original_tax: null,
            calculated_tax: null,
            tax_rates: null,
          },
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            title: "Test variant",
            product_id: "5VxiEkmnPV",
            sku: "test-sku-3",
            barcode: "test-barcode-3",
            ean: null,
            upc: null,
            inventory_quantity: 10,
            allow_backorder: false,
            manage_inventory: true,
            hs_code: null,
            origin_country: null,
            mid_code: null,
            material: null,
            weight: null,
            length: null,
            height: null,
            width: null,
            metadata: null,
            prices: [
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                currency_code: "usd",
                amount: 120,
                min_quantity: null,
                max_quantity: null,
                price_list_id: null,
                variant_id: expect.any(String),
                region_id: null,
                price_list: null,
              },
            ],
            options: [
              {
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                value: "Option 1 Value blue",
                option_id: expect.any(String),
                variant_id: expect.any(String),
                metadata: null,
              },
            ],
            original_price: null,
            calculated_price: null,
            original_price_incl_tax: null,
            calculated_price_incl_tax: null,
            original_tax: null,
            calculated_tax: null,
            tax_rates: null,
          },
        ],
        images: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            url: "test-image.png",
            metadata: null,
          },
        ],
        options: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            title: "test-option",
            product_id: "5VxiEkmnPV",
            metadata: null,
          },
        ],
        tags: [
          {
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            value: "123",
            metadata: null,
          },
        ],
        type: null,
        collection: null,
      },
    ])
  })
})
