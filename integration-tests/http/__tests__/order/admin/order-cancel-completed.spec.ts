import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container

    beforeEach(async () => {
      container = getContainer()
      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("POST /admin/orders/:id/cancel - Cancel completed orders", () => {
      it("should fail to cancel a completed order with proper error message", async () => {
        // Arrange: Create and complete an order
        const seeder = await createOrderSeeder({
          api,
          container,
        })
        const order = seeder.order

        await api.post(
          `/admin/orders/${order.id}/complete`,
          {},
          adminHeaders
        )

        // Verify order is completed
        const completedOrder = (
          await api.get(
            `/admin/orders/${order.id}`,
            adminHeaders
          )
        ).data.order

        expect(completedOrder.status).toBe("completed")

        // Act: Attempt to cancel the completed order
        const response = await api
          .post(`/admin/orders/${order.id}/cancel`, {}, adminHeaders)
          .catch((e) => e.response)

        // Assert: Should return 400 with proper error message
        expect(response.status).toBe(400)
        expect(response.data.type).toBe("not_allowed")
        expect(response.data.message).toMatch(/completed/i)
        expect(response.data.message).toMatch(/return|refund/i)
      })

      it("should not change order status when cancel attempt fails for completed order", async () => {
        // Arrange: Create and complete an order
        const seeder = await createOrderSeeder({
          api,
          container,
        })
        const order = seeder.order

        await api.post(
          `/admin/orders/${order.id}/complete`,
          {},
          adminHeaders
        )

        const orderBeforeCancelAttempt = (
          await api.get(
            `/admin/orders/${order.id}`,
            adminHeaders
          )
        ).data.order

        // Act: Attempt to cancel the completed order
        await api
          .post(`/admin/orders/${order.id}/cancel`, {}, adminHeaders)
          .catch((e) => e.response)

        // Assert: Order status should remain completed
        const orderAfterCancelAttempt = (
          await api.get(
            `/admin/orders/${order.id}`,
            adminHeaders
          )
        ).data.order

        expect(orderAfterCancelAttempt.status).toBe("completed")
        expect(orderAfterCancelAttempt.updated_at).toBe(
          orderBeforeCancelAttempt.updated_at
        )
      })
    })
  },
})
