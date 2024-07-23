import { IEventBusModuleService } from "@medusajs/types"
import { TestEventUtils, medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import FormData from "form-data"
import fs from "fs/promises"
import path from "path"
import { ModuleRegistrationName } from "@medusajs/utils"
import { getProductFixture } from "../../../../helpers/fixtures"

jest.setTimeout(50000)

const getUploadReq = (file: { name: string; content: string }) => {
  const form = new FormData()
  form.append("file", Buffer.from(file.content), file.name)
  return {
    form,
    meta: {
      headers: {
        ...adminHeaders.headers,
        ...form.getHeaders(),
      },
    },
  }
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseCollection
    let baseType
    let baseProduct

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
      it("should import a products CSV file", async () => {
        const subscriberExecution = TestEventUtils.waitSubscribersExecution(
          "notification.notification.created",
          eventBus
        )

        let fileContent = await fs.readFile(
          path.join(__dirname, "__fixtures__", "exported-products.csv"),
          { encoding: "utf-8" }
        )

        const { form, meta } = getUploadReq({
          name: "test.csv",
          content: fileContent,
        })

        // BREAKING: The batch endpoints moved to the domain routes (admin/batch-jobs -> /admin/products/import). The payload and response changed as well.
        const batchJobRes = await api.post("/admin/products/import", form, meta)

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
              title: "Product import",
              description: `Product import of file test.csv completed successfully!`,
            }),
          })
        )
      })
    })
  },
})
