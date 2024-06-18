import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeAll(() => {})

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("POST /admin/payment-collections/:id/payment-sessions", () => {
      let region

      beforeEach(async () => {
        region = (
          await api.post(
            "/admin/regions",
            { name: "United States", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region
      })

      it("should create a payment session", async () => {
        const paymentCollection = (
          await api.post(`/store/payment-collections`, {
            region_id: region.id,
            cart_id: "cart.id",
            amount: 150,
            currency_code: "usd",
          })
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" }
        )

        // Adding a second payment session to ensure only one session gets created
        const {
          data: { payment_collection },
        } = await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" }
        )

        expect(payment_collection.payment_sessions).toEqual([
          expect.objectContaining({
            currency_code: "usd",
            provider_id: "pp_system_default",
            status: "pending",
            amount: 150,
          }),
        ])
      })
    })
  },
})
