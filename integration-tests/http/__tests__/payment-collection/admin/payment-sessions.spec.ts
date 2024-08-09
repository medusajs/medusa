import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { getProductFixture } from "../../../../helpers/fixtures"

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
      let product
      let cart

      beforeEach(async () => {
        region = (
          await api.post(
            "/admin/regions",
            { name: "United States", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        product = (
          await api.post(
            "/admin/products",
            getProductFixture({
              title: "test",
              status: "published",
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                  prices: [
                    {
                      amount: 150,
                      currency_code: "usd",
                      rules: { region_id: region.id },
                    },
                  ],
                },
              ],
            }),
            adminHeaders
          )
        ).data.product

        cart = (
          await api.post("/store/carts", {
            region_id: region.id,
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
          })
        ).data.cart
      })

      it("should create a payment session", async () => {
        const paymentCollection = (
          await api.post(`/store/payment-collections`, {
            cart_id: cart.id,
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
