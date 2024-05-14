import fs from "fs"
import path from "path"

import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import { simpleProductFactory } from "../../../../factories"
import { simpleProductCollectionFactory } from "../../../../factories/simple-product-collection-factory"
import batchJobSeeder from "../../../../helpers/batch-job-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

const setupServer = require("../../../../environment-helpers/setup-server")
const userSeeder = require("../../../../helpers/user-seeder")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

function getImportFile() {
  return path.resolve(
    "__tests__",
    "product",
    "admin",
    "__fixtures__",
    "product-import.csv"
  )
}

function copyTemplateFile() {
  const csvTemplate = path.resolve(
    "__tests__",
    "product",
    "admin",
    "__fixtures__",
    "product-import-template.csv"
  )
  const destination = getImportFile()

  fs.copyFileSync(csvTemplate, destination)
}

jest.setTimeout(1000000)

function cleanTempData() {
  // cleanup tmp ops files
  const opsFiles = path.resolve("__tests__", "product", "admin", "imports")

  fs.rmSync(opsFiles, { recursive: true, force: true })
}

const env: Record<any, any> = {
  MEDUSA_FF_MEDUSA_V2: true,
}

// TODO SEE to use new test runner medusaIntegrationTestRunner({
//   env,
//   testSuite: ({ dbConnection, getContainer, api }) => {})

describe.skip("Product import batch job", () => {
  let dbConnection
  let shutdownServer
  let medusaProcess

  const collectionHandle1 = "test-collection1"
  const collectionHandle2 = "test-collection2"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    env.UPLOAD_DIR = __dirname

    cleanTempData() // cleanup if previous process didn't manage to do it

    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    medusaProcess = await setupServer({
      cwd,
      uploadDir: __dirname,
      env,
      verbose: true,
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    cleanTempData()

    await medusaProcess.kill()
    await shutdownServer()
  })

  beforeEach(async () => {
    const container = getContainer()
    await createDefaultRuleTypes(container)
    await batchJobSeeder(dbConnection)
    await createAdminUser(dbConnection, adminHeaders, container)
    await userSeeder(dbConnection)
    await simpleProductCollectionFactory(dbConnection, [
      {
        handle: collectionHandle1,
      },
      {
        handle: collectionHandle2,
      },
    ])
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  it("should import a csv file", async () => {
    jest.setTimeout(1000000)
    const api = useApi()
    copyTemplateFile()

    const existingProductToBeUpdated = await simpleProductFactory(
      dbConnection,
      {
        id: "existing-product-id",
        title: "Test product",
        options: [{ id: "opt-1-id", title: "Size" }],
        variants: [
          {
            id: "existing-variant-id",
            title: "Initial tile",
            sku: "test-sku-4",
            options: [
              {
                option_id: "opt-1-id",
                value: "Large",
              },
            ],
          },
        ],
      }
    )

    const response = await api.post(
      "/admin/batch-jobs",
      {
        type: "product-import",
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
    expect(productsResponse.data.count).toBe(3)

    expect(productsResponse.data.products).toEqual(
      expect.arrayContaining([
        // NEW PRODUCT
        expect.objectContaining({
          title: "Test product",
          description:
            "Hopper Stripes Bedding, available as duvet cover, pillow sham and sheet.\\n100% organic cotton, soft and crisp to the touch. Made in Portugal.",
          handle: "test-product-product-1",
          is_giftcard: false,
          status: "draft",
          thumbnail: "test-image.png",
          variants: [
            // NEW VARIANT
            expect.objectContaining({
              title: "Test variant",
              sku: "test-sku-1",
              barcode: "test-barcode-1",
              ean: null,
              upc: null,
              // inventory_quantity: 10,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  currency_code: "eur",
                  amount: 100,
                  region_id: "region-product-import-0",
                }),
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 110,
                }),
                expect.objectContaining({
                  currency_code: "dkk",
                  amount: 130,
                  region_id: "region-product-import-1",
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "option 1 value red",
                }),
                expect.objectContaining({
                  value: "option 2 value 1",
                }),
              ]),
            }),
          ],
          type: null,
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image.png",
            }),
          ]),
          options: expect.arrayContaining([
            expect.objectContaining({
              title: "test-option-1",
            }),
            expect.objectContaining({
              title: "test-option-2",
            }),
          ]),
          tags: expect.arrayContaining([
            expect.objectContaining({
              value: "123_1",
            }),
          ]),
          collection: expect.objectContaining({
            handle: collectionHandle1,
          }),
        }),
        expect.objectContaining({
          title: "Test product",
          description:
            "Hopper Stripes Bedding, available as duvet cover, pillow sham and sheet.\\n100% organic cotton, soft and crisp to the touch. Made in Portugal.",
          handle: "test-product-product-1-1",
          is_giftcard: false,
          status: "draft",
          thumbnail: "test-image.png",
          variants: [
            // NEW VARIANT
            expect.objectContaining({
              title: "Test variant",
              sku: "test-sku-1-1",
              barcode: "test-barcode-1-1",
              ean: null,
              upc: null,
              // inventory_quantity: 10,
              prices: expect.arrayContaining([
                expect.objectContaining({
                  currency_code: "eur",
                  amount: 100,
                  region_id: "region-product-import-0",
                }),
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 110,
                }),
                expect.objectContaining({
                  currency_code: "dkk",
                  amount: 130,
                  region_id: "region-product-import-1",
                }),
              ]),
              options: expect.arrayContaining([
                expect.objectContaining({
                  value: "option 1 value red",
                }),
                expect.objectContaining({
                  value: "option 2 value 1",
                }),
              ]),
            }),
          ],
          type: null,
          images: expect.arrayContaining([
            expect.objectContaining({
              url: "test-image.png",
            }),
          ]),
          options: expect.arrayContaining([
            expect.objectContaining({
              title: "test-option-1",
            }),
            expect.objectContaining({
              title: "test-option-2",
            }),
          ]),
          tags: [],
          collection: expect.objectContaining({
            handle: collectionHandle1,
          }),
        }),
        // // UPDATED PRODUCT
        expect.objectContaining({
          id: existingProductToBeUpdated?.id,
          title: "Test product",
          description: "test-product-description",
          handle: "test-product-product-2",
          is_giftcard: false,
          status: "draft",
          thumbnail: "test-image.png",
          profile_id: expect.any(String),
          variants: expect.arrayContaining([
            // UPDATED VARIANT
            expect.objectContaining({
              id: "existing-variant-id",
              title: "Test variant changed",
              sku: "test-sku-4",
              barcode: "test-barcode-4",
              options: [
                expect.objectContaining({
                  value: "Large",
                  option_id: "opt-1-id",
                }),
              ],
            }),
            // CREATED VARIANT
            expect.objectContaining({
              title: "Test variant",
              product_id: existingProductToBeUpdated.id,
              sku: "test-sku-2",
              barcode: "test-barcode-2",
              ean: null,
              upc: null,
              // inventory_quantity: 10,
              allow_backorder: false,
              manage_inventory: true,
              prices: [
                expect.objectContaining({
                  currency_code: "dkk",
                  amount: 110,
                  region_id: "region-product-import-2",
                }),
              ],
              options: [
                expect.objectContaining({
                  value: "Small",
                  option_id: "opt-1-id",
                }),
              ],
            }),
            // CREATED VARIANT
            expect.objectContaining({
              title: "Test variant",
              product_id: existingProductToBeUpdated.id,
              sku: "test-sku-3",
              barcode: "test-barcode-3",
              ean: null,
              upc: null,
              // inventory_quantity: 10,
              allow_backorder: false,
              manage_inventory: true,
              prices: [
                expect.objectContaining({
                  currency_code: "usd",
                  amount: 120,
                  region_id: null,
                }),
              ],
              options: [
                expect.objectContaining({
                  value: "Medium",
                  option_id: "opt-1-id",
                }),
              ],
            }),
          ]),
          images: [
            expect.objectContaining({
              url: "test-image.png",
            }),
          ],
          options: [
            expect.objectContaining({
              product_id: existingProductToBeUpdated.id,
              id: "opt-1-id",
              title: "Size",
            }),
          ],
          type: expect.objectContaining({ value: "test-type" }),
          tags: [
            expect.objectContaining({
              value: "123",
            }),
          ],
          collection: expect.objectContaining({
            handle: collectionHandle2,
          }),
        }),
      ])
    )
  })
})
