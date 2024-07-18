import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseProduct
    let proposedProduct

    let baseCollection
    let publishedCollection

    let baseType

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
            collection_id: baseCollection.id,
            type_id: baseType.id,
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

    describe("POST /admin/products/export", () => {
      it("should export a csv file containing the expected products", async () => {
        // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/export). The payload and response changed as well.
        const batchJobRes = await api.post(
          "/admin/products/export",
          {},
          adminHeaders
        )

        const workflowId = batchJobRes.data.workflow_id
        expect(workflowId).toBeTruthy()

        // Pull to check the status until it is completed
        while (true) {
          //   const res = await api.get(
          //     `/admin/batch-jobs/${batchJobId}`,
          //     adminReqConfig
          //   )
          //   await new Promise((resolve, _) => {
          //     setTimeout(resolve, 1000)
          //   })
          //   batchJob = res.data.batch_job
          //   shouldContinuePulling = !(
          //     batchJob.status === "completed" || batchJob.status === "failed"
          //   )
          break
        }

        // expect(batchJob.status).toBe("completed")

        // exportFilePath = path.resolve(__dirname, batchJob.result.file_key)
        // const isFileExists = (await fs.stat(exportFilePath)).isFile()

        // expect(isFileExists).toBeTruthy()

        // const fileSize = (await fs.stat(exportFilePath)).size
        // expect(batchJob.result?.file_size).toBe(fileSize)

        // const data = (await fs.readFile(exportFilePath)).toString()
        // const [, ...lines] = data.split("\r\n").filter((l) => l)

        // expect(lines.length).toBe(1)

        // const lineColumn = lines[0].split(";")

        // expect(lineColumn[0]).toBe(productId)
        // expect(lineColumn[2]).toBe(productPayload.title)
        // expect(lineColumn[4]).toBe(productPayload.description)
        // expect(lineColumn[23]).toBe(variantId)
        // expect(lineColumn[24]).toBe(productPayload.variants[0].title)
        // expect(lineColumn[25]).toBe(productPayload.variants[0].sku)
      })

      //   it("should export a csv file containing the expected products including new line char in the cells", async () => {
      //    const api = useApi()

      //     const productPayload = {
      //       title: "Test export product",
      //       description: "test-product-description\ntest line 2",
      //       type: { value: "test-type" },
      //       images: ["test-image.png", "test-image-2.png"],
      //       collection_id: "test-collection",
      //       tags: [{ value: "123" }, { value: "456" }],
      //       options: [{ title: "size" }, { title: "color" }],
      //       variants: [
      //         {
      //           title: "Test variant",
      //           inventory_quantity: 10,
      //           sku: "test-variant-sku-product-export",
      //           prices: [
      //             {
      //               currency_code: "usd",
      //               amount: 100,
      //             },
      //             {
      //               currency_code: "eur",
      //               amount: 45,
      //             },
      //             {
      //               currency_code: "dkk",
      //               amount: 30,
      //             },
      //           ],
      //           options: [{ value: "large" }, { value: "green" }],
      //         },
      //       ],
      //     }
      //     const createProductRes = await api.post(
      //       "/admin/products",
      //       productPayload,
      //       adminReqConfig
      //     )
      //     const productId = createProductRes.data.product.id
      //     const variantId = createProductRes.data.product.variants[0].id

      //     const batchPayload = {
      //       type: "product-export",
      //       context: {
      //         filterable_fields: {
      //           title: "Test export product",
      //         },
      //       },
      //     }
      //     const batchJobRes = await api.post(
      //       "/admin/batch-jobs",
      //       batchPayload,
      //       adminReqConfig
      //     )
      //     const batchJobId = batchJobRes.data.batch_job.id

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

      //     const fileSize = (await fs.stat(exportFilePath)).size
      //     expect(batchJob.result?.file_size).toBe(fileSize)

      //     const data = (await fs.readFile(exportFilePath)).toString()
      //     const [, ...lines] = data.split("\r\n").filter((l) => l)

      //     expect(lines.length).toBe(1)

      //     const lineColumn = lines[0].split(";")

      //     expect(lineColumn[0]).toBe(productId)
      //     expect(lineColumn[2]).toBe(productPayload.title)
      //     expect(lineColumn[4]).toBe(`"${productPayload.description}"`)
      //     expect(lineColumn[23]).toBe(variantId)
      //     expect(lineColumn[24]).toBe(productPayload.variants[0].title)
      //     expect(lineColumn[25]).toBe(productPayload.variants[0].sku)
      //   })

      //   it("should export a csv file containing a limited number of products", async () => {
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
      //     const batchJobId = batchJobRes.data.batch_job.id

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
      //     const [, ...lines] = data.split("\r\n").filter((l) => l)

      //     expect(lines.length).toBe(4)

      //     const csvLine = lines[0].split(";")
      //     expect(csvLine[0]).toBe("test-product")
      //   })

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
