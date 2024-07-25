import { IEventBusModuleService } from "@medusajs/types"
import { TestEventUtils, medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"
import fs from "fs/promises"
import path from "path"
import { ModuleRegistrationName } from "@medusajs/utils"

jest.setTimeout(50000)

const compareCSVs = async (filePath, expectedFilePath) => {
  let fileContent = await fs.readFile(filePath, { encoding: "utf-8" })
  let fixturesContent = await fs.readFile(expectedFilePath, {
    encoding: "utf-8",
  })

  // Normalize csv data to get rid of dynamic data
  const idsToReplace = ["prod_", "pcol_", "variant_", "ptyp_"]
  const dateRegex =
    /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/g
  idsToReplace.forEach((prefix) => {
    fileContent = fileContent.replace(
      new RegExp(`${prefix}\\w*\\d*`, "g"),
      "<ID>"
    )
    fixturesContent = fixturesContent.replace(
      new RegExp(`${prefix}\\w*\\d*`, "g"),
      "<ID>"
    )
  })
  fileContent = fileContent.replace(dateRegex, "<DATE>")
  fixturesContent = fixturesContent.replace(dateRegex, "<DATE>")

  expect(fileContent).toEqual(fixturesContent)
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseProduct
    let proposedProduct

    let baseCollection
    let publishedCollection

    let baseType

    let eventBus: IEventBusModuleService
    beforeAll(async () => {
      eventBus = getContainer().resolve(ModuleRegistrationName.EVENT_BUS)
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "base-collection" },
          adminHeaders
        )
      ).data.collection

      publishedCollection = (
        await api.post(
          "/admin/collections",
          { title: "proposed-collection" },
          adminHeaders
        )
      ).data.collection

      baseType = (
        await api.post(
          "/admin/product-types",
          { value: "test-type" },
          adminHeaders
        )
      ).data.product_type

      baseProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Base product",
            description: "test-product-description\ntest line 2",
            collection_id: baseCollection.id,
            type_id: baseType.id,
            variants: [
              {
                title: "Test variant",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 100,
                  },
                  {
                    currency_code: "eur",
                    amount: 45,
                  },
                  {
                    currency_code: "dkk",
                    amount: 30,
                  },
                ],
                options: {
                  size: "large",
                  color: "green",
                },
              },
              {
                title: "Test variant 2",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 200,
                  },
                  {
                    currency_code: "eur",
                    amount: 65,
                  },
                  {
                    currency_code: "dkk",
                    amount: 50,
                  },
                ],
                options: {
                  size: "small",
                  color: "green",
                },
              },
            ],
          }),
          adminHeaders
        )
      ).data.product

      proposedProduct = (
        await api.post(
          "/admin/products",
          getProductFixture({
            title: "Proposed product",
            status: "proposed",
            tags: [{ value: "new-tag" }],
            type_id: baseType.id,
          }),
          adminHeaders
        )
      ).data.product
    })

    afterEach(() => {
      ;(eventBus as any).eventEmitter_.removeAllListeners()
    })

    describe("POST /admin/products/export", () => {
      it("should export a csv file containing the expected products", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          "notification.notification.created",
          eventBus
        )

        // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/export). The payload and response changed as well.
        const batchJobRes = await api.post(
          "/admin/products/export",
          {},
          adminHeaders
        )

        const workflowId = batchJobRes.data.workflow_id
        expect(workflowId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)
        expect(notifications[0]).toEqual(
          expect.objectContaining({
            data: expect.objectContaining({
              title: "Product export",
              description: "Product export completed successfully!",
              file: expect.objectContaining({
                url: expect.stringContaining("-product-exports.csv"),
                filename: expect.any(String),
                mimeType: "text/csv",
              }),
            }),
          })
        )

        await compareCSVs(
          notifications[0].data.file.url,
          path.join(__dirname, "__fixtures__", "exported-products.csv")
        )
        await fs.rm(path.dirname(notifications[0].data.file.url), {
          force: true,
          recursive: true,
        })
      })

      it("should export a csv file filtered by specific products", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          "notification.notification.created",
          eventBus
        )

        // BREAKING: We don't support setting batch size in the export anymore
        const batchJobRes = await api.post(
          `/admin/products/export?id=${proposedProduct.id}`,
          {},
          adminHeaders
        )

        const workflowId = batchJobRes.data.workflow_id
        expect(workflowId).toBeTruthy()

        await subscriberExecution
        const notifications = (
          await api.get("/admin/notifications", adminHeaders)
        ).data.notifications

        expect(notifications.length).toBe(1)

        await compareCSVs(
          notifications[0].data.file.url,
          path.join(__dirname, "__fixtures__", "filtered-products.csv")
        )

        await fs.rm(path.dirname(notifications[0].data.file.url), {
          force: true,
          recursive: true,
        })
      })

      //   it("should be able to import an exported csv file", async () => {
      //     const api = useApi()

      //     const batchPayload = {
      //       type: "product-export",
      //       context: {
      //         batch_size: 1,
      //         filterable_fields: { collection_id: "test-collection" },
      //         order: "created_at",
      //       },
      //     }

      //     const batchJobRes = await api.post(
      //       "/admin/batch-jobs",
      //       batchPayload,
      //       adminReqConfig
      //     )
      //     let batchJobId = batchJobRes.data.batch_job.id

      //     expect(batchJobId).toBeTruthy()

      //     // Pull to check the status until it is completed
      //     let batchJob
      //     let shouldContinuePulling = true
      //     while (shouldContinuePulling) {
      //       const res = await api.get(
      //         `/admin/batch-jobs/${batchJobId}`,
      //         adminReqConfig
      //       )

      //       await new Promise((resolve, _) => {
      //         setTimeout(resolve, 1000)
      //       })

      //       batchJob = res.data.batch_job
      //       shouldContinuePulling = !(
      //         batchJob.status === "completed" || batchJob.status === "failed"
      //       )
      //     }

      //     expect(batchJob.status).toBe("completed")

      //     exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
      //     const isFileExists = (await fs.stat(exportFilePath)).isFile()

      //     expect(isFileExists).toBeTruthy()

      //     const data = (await fs.readFile(exportFilePath)).toString()
      //     const [header, ...lines] = data.split("\r\n").filter((l) => l)

      //     expect(lines.length).toBe(4)

      //     const csvLine = lines[0].split(";")
      //     expect(csvLine[0]).toBe("test-product")
      //     expect(csvLine[2]).toBe("Test product")

      //     csvLine[2] = "Updated test product"
      //     lines.splice(0, 1, csvLine.join(";"))

      //     await fs.writeFile(exportFilePath, [header, ...lines].join("\r\n"))

      //     const importBatchJobRes = await api.post(
      //       "/admin/batch-jobs",
      //       {
      //         type: "product-import",
      //         context: {
      //           fileKey: exportFilePath,
      //         },
      //       },
      //       adminReqConfig
      //     )

      //     batchJobId = importBatchJobRes.data.batch_job.id

      //     expect(batchJobId).toBeTruthy()

      //     shouldContinuePulling = true
      //     while (shouldContinuePulling) {
      //       const res = await api.get(
      //         `/admin/batch-jobs/${batchJobId}`,
      //         adminReqConfig
      //       )

      //       await new Promise((resolve, _) => {
      //         setTimeout(resolve, 1000)
      //       })

      //       batchJob = res.data.batch_job

      //       shouldContinuePulling = !(
      //         batchJob.status === "completed" || batchJob.status === "failed"
      //       )
      //     }

      //     expect(batchJob.status).toBe("completed")

      //     const productsResponse = await api.get(
      //       "/admin/products",
      //       adminReqConfig
      //     )
      //     expect(productsResponse.data.count).toBe(5)
      //     expect(productsResponse.data.products).toEqual(
      //       expect.arrayContaining([
      //         expect.objectContaining({
      //           id: csvLine[0],
      //           handle: csvLine[1],
      //           title: csvLine[2],
      //         }),
      //       ])
      //     )
      //   })
    })
  },
})
