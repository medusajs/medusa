import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import { Modules, ProductEvents } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let eventBus: IEventBusModuleService

    beforeAll(async () => {
      const appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)
      eventBus = appContainer.resolve(Modules.EVENT_BUS)
      await dbUtils.snapshot()
    })

    describe("Product Category Events", () => {
      it("triggers PRODUCT_CATEGORY_DELETED when a category is deleted", async () => {
        const subscriberMock = jest.fn()
        
        // Register subscriber using the exported constant
        eventBus.subscribe(ProductEvents.PRODUCT_CATEGORY_DELETED, subscriberMock, {
          subscriberId: "test-product-category-deleted",
        })

        // Create a product category
        const createResponse = await api.post(
          "/admin/product-categories",
          {
            name: "test category",
          },
          adminHeaders
        )
        const categoryId = createResponse.data.product_category.id

        // Delete the product category
        const deleteResponse = await api.delete(
          `/admin/product-categories/${categoryId}`,
          adminHeaders
        )
        expect(deleteResponse.status).toEqual(200)

        // Wait for the event bus to process the emitted job
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Assert the subscriber was triggered
        expect(subscriberMock).toHaveBeenCalledTimes(1)
        
        // Assert it was called with the correct event payload
        const callArgs = subscriberMock.mock.calls[0][0]
        
        // Log the payload to ensure we know its structure if it fails
        console.log("Subscriber payload:", JSON.stringify(callArgs, null, 2))
        
        expect(callArgs.data.id).toEqual(categoryId)
      })
    })
  },
})
