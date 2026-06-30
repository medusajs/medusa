import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let order

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      const result = await createOrderSeeder({ api, container })
      order = result.order

      await dbUtils.snapshot()
    })

    describe("POST /admin/payment-collections/:id/mark-as-paid", () => {
      const createCollection = async () => {
        return (
          await api.post(
            "/admin/payment-collections",
            { order_id: order.id, amount: 100 },
            adminHeaders
          )
        ).data.payment_collection
      }

      const getCollectionPayments = async (collectionId) => {
        const { data } = await api.get(
          `/admin/orders/${order.id}?fields=id,*payment_collections.payments`,
          adminHeaders
        )
        return data.order.payment_collections.find(
          (pc) => pc.id === collectionId
        ).payments
      }

      it("records the captured payment under the system provider by default", async () => {
        const collection = await createCollection()

        const { data } = await api.post(
          `/admin/payment-collections/${collection.id}/mark-as-paid`,
          { order_id: order.id },
          adminHeaders
        )

        expect(data.payment_collection).toEqual(
          expect.objectContaining({ status: "completed" })
        )

        const payments = await getCollectionPayments(collection.id)
        expect(payments).toEqual([
          expect.objectContaining({
            provider_id: "pp_system_default",
            amount: 100,
          }),
        ])
        expect(payments[0].captured_at).toBeTruthy()
      })

      it("records the captured payment under the provider passed in provider_id", async () => {
        const collection = await createCollection()

        const { data } = await api.post(
          `/admin/payment-collections/${collection.id}/mark-as-paid`,
          { order_id: order.id, provider_id: "pp_system_default_2" },
          adminHeaders
        )

        expect(data.payment_collection).toEqual(
          expect.objectContaining({ status: "completed" })
        )

        const payments = await getCollectionPayments(collection.id)
        expect(payments).toEqual([
          expect.objectContaining({
            provider_id: "pp_system_default_2",
            amount: 100,
          }),
        ])
        expect(payments[0].captured_at).toBeTruthy()
      })
    })
  },
})
