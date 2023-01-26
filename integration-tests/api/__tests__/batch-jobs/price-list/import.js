const fs = require("fs")
const path = require("path")

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")
const {
  simpleRegionFactory,
  simplePriceListFactory,
  simpleProductFactory,
} = require("../../../factories")

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
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
    dbConnection = await initDb({ cwd })

    cleanTempData() // cleanup if previous process didn't manage to do it

    medusaProcess = await setupServer({
      cwd,
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
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should import a csv file", async () => {
    jest.setTimeout(1000000)
    const api = useApi()

    copyTemplateFile()

    const product = await simpleProductFactory(dbConnection, {
      options: [
        {
          title: "Size",
          id: "size",
        },
      ],
      variants: [
        {
          id: "test-pl-variant",
          options: [
            {
              option_id: "size",
              value: "S",
            },
          ],
        },
        {
          id: "test-pl-sku-variant",
          sku: "pl-sku",
          options: [
            {
              option_id: "size",
              value: "M",
            },
          ],
        },
      ],
    })

    await simpleRegionFactory(dbConnection, {
      id: "test-pl-region",
      name: "PL Region",
      currency_code: "eur",
    })

    const priceList = await simplePriceListFactory(dbConnection, {
      id: "pl_my_price_list",
      name: "Test price list",
      prices: [
        {
          variant_id: product.variants[0].id,
          currency_code: "usd",
          amount: 1000,
        },
        {
          variant_id: product.variants[0].id,
          currency_code: "eur",
          amount: 2080,
        },
      ],
    })

    const response = await api.post(
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
      "/admin/price-lists/pl_my_price_list",
      adminReqConfig
    )

    // Verify that file service deleted file
    const importFilePath = getImportFile()
    expect(fs.existsSync(importFilePath)).toBe(false)

    expect(priceListRes.data.price_list.prices.length).toEqual(5)
    expect(priceListRes.data.price_list.prices).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          variant_id: "test-pl-variant",
          currency_code: "usd",
          amount: 1111,
        }),
        expect.objectContaining({
          variant_id: "test-pl-variant",
          currency_code: "eur",
          region_id: "test-pl-region",
          amount: 2222,
        }),
        expect.objectContaining({
          variant_id: "test-pl-variant",
          currency_code: "jpy",
          amount: 3333,
        }),
        expect.objectContaining({
          variant_id: "test-pl-sku-variant",
          currency_code: "usd",
          amount: 4444,
        }),
        expect.objectContaining({
          variant_id: "test-pl-sku-variant",
          currency_code: "eur",
          region_id: "test-pl-region",
          amount: 5555,
        }),
      ])
    )
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

    const priceList = await simplePriceListFactory(dbConnection, {
      id: "pl_my_price_list",
      name: "Test price list",
      prices: [
        {
          variant_id: product.variants[0].id,
          currency_code: "usd",
          amount: 1000,
        },
        {
          variant_id: product.variants[0].id,
          currency_code: "eur",
          amount: 2080,
        },
      ],
    })

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "price-list-import",
        context: {
          price_list_id: priceList.id,
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
