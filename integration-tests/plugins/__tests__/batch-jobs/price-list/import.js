const fs = require("fs")
const path = require("path")

const setupServer = require("../../../../environment-helpers/setup-server")
const { useApi } = require("../../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")

const adminSeeder = require("../../../../helpers/admin-seeder")
const {
  simpleRegionFactory,
  simplePriceListFactory,
  simpleProductFactory,
} = require("../../../../factories")
const {
  startBootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const {
  createVariantPriceSet,
} = require("../../../helpers/create-variant-price-set")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

jest.setTimeout(1000000)

function cleanTempData() {
  // cleanup tmp ops files
  const opsFiles = path.resolve(
    "__tests__",
    "batch-jobs",
    "price-list",
    "imports"
  )

  fs.rmSync(opsFiles, { recursive: true, force: true })
}

function getImportFile() {
  return path.resolve(
    "__tests__",
    "batch-jobs",
    "price-list",
    "price-list-import.csv"
  )
}

function copyTemplateFile() {
  const csvTemplate = path.resolve(
    "__tests__",
    "batch-jobs",
    "price-list",
    "price-list-import-template.csv"
  )
  const destination = getImportFile()
  fs.copyFileSync(csvTemplate, destination)
}

describe("Price list import batch job", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({
      cwd,
      env: {
        MEDUSA_FF_MEDUSA_V2: true,
      },
    })

    cleanTempData() // cleanup if previous process didn't manage to do it

    medusaProcess = await setupServer({
      cwd,
      verbose: true,
      env: {
        MEDUSA_FF_MEDUSA_V2: true,
      },
      uploadDir: __dirname,
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    cleanTempData()

    medusaProcess.kill()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)

    await dbConnection.manager
      .query(`INSERT INTO rule_type(id, name, rule_attribute)
              VALUES ('1', 'region_id', 'region_id')`)
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should import a csv file", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    copyTemplateFile()

    await simpleRegionFactory(dbConnection, {
      id: "test-pl-region",
      name: "PL Region",
      currency_code: "eur",
    })

    await simpleRegionFactory(dbConnection, {
      id: "test-pl-region-usd",
      name: "PL Region",
      currency_code: "usd",
    })

    const data = {
      title: "test product",
      variants: [
        {
          title: "test variant",
          prices: [
            {
              amount: 66600,
              region_id: "test-pl-region",
            },
            {
              amount: 55500,
              currency_code: "usd",
            },
          ],
        },
        {
          title: "test variant",
          sku: "pl-sku",
          prices: [
            {
              amount: 77700,
              region_id: "test-pl-region",
            },
            {
              amount: 88800,
              currency_code: "usd",
            },
          ],
        },
      ],
    }

    const productRes = await api.post(
      "/admin/products?relations=variants.prices",
      data,
      adminReqConfig
    )

    await dbConnection.manager.query(`UPDATE product_variant
                                      SET id='test-pl-variant'
                                      where id = '${productRes.data.product.variants[0].id}'`)
    await dbConnection.manager.query(`UPDATE product_variant_price_set
                                      SET variant_id='test-pl-variant'
                                      where variant_id = '${productRes.data.product.variants[0].id}'`)

    const priceListResponse = await api.post(
      `/admin/price-lists`,
      {
        name: "testpl",
        description: "testpl",
        type: "sale",
        prices: [],
      },
      adminReqConfig
    )

    const priceList = priceListResponse.data.price_list

    const response = await api
      .post(
        "/admin/batch-jobs",
        {
          type: "price-list-import",
          context: {
            price_list_id: priceList.id,
            fileKey: "price-list-import.csv",
          },
        },
        adminReqConfig
      )
      .catch((err) => console.log(err))

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

    const priceListRes = await api.get(
      `/admin/price-lists/${priceList.id}`,
      adminReqConfig
    )

    // Verify that file service deleted file
    const importFilePath = getImportFile()
    expect(fs.existsSync(importFilePath)).toBe(false)

    expect(priceListRes.data.price_list.prices.length).toEqual(4)
    expect(priceListRes.data.price_list.prices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          currency_code: "usd",
          amount: 1111,
        }),
        expect.objectContaining({
          currency_code: "eur",
          region_id: "test-pl-region",
          amount: 2222,
        }),
        expect.objectContaining({
          currency_code: "usd",
          amount: 4444,
        }),
        expect.objectContaining({
          currency_code: "eur",
          region_id: "test-pl-region",
          amount: 5555,
        }),
      ])
    )
  })

  it("should fail to import a csv file without existing products and regions", async () => {
    jest.setTimeout(1000000)
    const api = useApi()
    const priceListResponse = await api.post(
      `/admin/price-lists`,
      {
        name: "testpl",
        description: "testpl",
        type: "sale",
        prices: [],
      },
      adminReqConfig
    )
    // copyTemplateFile()
    await simpleRegionFactory(dbConnection, {
      id: "test-pl-region",
      name: "PL Region",
      currency_code: "eur",
    })

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "price-list-import",
        context: {
          price_list_id: priceListResponse.data.price_list.id,
          fileKey: "price-list-import-non-existing-variant-and-sku.csv",
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
      const res = await api
        .get(`/admin/batch-jobs/${batchJobId}`, adminReqConfig)
        .catch((err) => {
          console.log(err)
        })

      await new Promise((resolve, _) => {
        setTimeout(resolve, 1000)
      })

      batchJob = res.data.batch_job

      shouldContinuePulling = !(
        batchJob.status === "completed" || batchJob.status === "failed"
      )
    }

    expect(batchJob.status).toBe("failed")

    expect(batchJob.result.errors).toEqual([
      `Invalid input data Variants with ids: variant-id-does-not-exist not found, Variants with skus: variant-sku-does-not-exist not found`,
    ])
  })

  it("should fail with invalid import format", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    const product = await simpleProductFactory(dbConnection, {
      variants: [
        {
          id: "test-pl-variant",
        },
        {
          id: "test-pl-sku-variant",
          sku: "pl-sku",
        },
      ],
    })

    await simpleRegionFactory(dbConnection, {
      id: "test-pl-region",
      name: "PL Region",
      currency_code: "eur",
    })

    const priceListResponse = await api.post(
      `/admin/price-lists`,
      {
        name: "testpl",
        description: "testpl",
        type: "sale",
        prices: [],
      },
      adminReqConfig
    )

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "price-list-import",
        context: {
          price_list_id: priceListResponse.data.price_list.id,
          fileKey: "invalid-format.csv",
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

    expect(batchJob.status).toBe("failed")
    expect(batchJob.result).toEqual({
      errors: [
        "The csv file parsing failed due to: Unable to treat column non-descript-column from the csv file. No target column found in the provided schema",
      ],
    })
  })
})
