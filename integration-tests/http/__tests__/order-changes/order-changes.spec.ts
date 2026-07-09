import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { createOrderSeeder } from "../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let order
    let container

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const seeder = await createOrderSeeder({ api, container: getContainer() })
      order = seeder.order

      await dbUtils.snapshot()
    })

    describe("POST /admin/order-changes/:id", () => {
      it("should accept and persist internal_note on an order change", async () => {
        const result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test order edit",
          },
          adminHeaders
        )

        const orderChangeId = result.data.order_change.id

        const updateResult = await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            internal_note: "Test internal note",
          },
          adminHeaders
        )

        expect(updateResult.status).toEqual(200)
        expect(updateResult.data.order_change).toBeDefined()
        expect(updateResult.data.order_change.internal_note).toEqual(
          "Test internal note"
        )
      })

      it("should accept null internal_note (clearing the note)", async () => {
        const result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test order edit",
          },
          adminHeaders
        )

        const orderChangeId = result.data.order_change.id

        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            internal_note: "Temp note",
          },
          adminHeaders
        )

        const updateResult = await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            internal_note: null,
          },
          adminHeaders
        )

        expect(updateResult.status).toEqual(200)
        expect(updateResult.data.order_change.internal_note).toBeNull()
      })
    })
  },
})
