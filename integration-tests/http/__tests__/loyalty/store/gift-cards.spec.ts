import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(60 * 1000)

const giftCardPayload = {
  currency_code: "usd",
  value: 1000,
  code: "TEST1",
  line_item_id: "lin_123",
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let customer
    let storeHeaders

    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      const publishableKey = await generatePublishableKey(getContainer())
      storeHeaders = generateStoreHeaders({ publishableKey })

      const user = await createAuthenticatedCustomer(api, storeHeaders, {
        email: "initial@customer.com",
      })

      storeHeaders.headers["Authorization"] = `Bearer ${user.jwt}`
      customer = user.customer

      await dbUtils.snapshot()
    })

    describe("GET /store/gift-cards/:code", () => {
      it("should retrieve a gift card by code", async () => {
        const created = (
          await api.post(`/admin/gift-cards`, giftCardPayload, adminHeaders)
        ).data.gift_card

        const {
          data: { gift_card },
        } = await api.get(`/store/gift-cards/${created.code}`, storeHeaders)

        expect(gift_card).toEqual(
          expect.objectContaining({
            id: created.id,
            code: "TEST1",
            currency_code: "usd",
            value: 1000,
          })
        )
      })

      it("should return not found for an invalid code", async () => {
        const { response } = await api
          .get(`/store/gift-cards/INVALID-CODE`, storeHeaders)
          .catch((e) => e)

        expect(response.status).toBe(404)
        expect(response.data.message).toBe("Gift card not found")
      })
    })
  },
})
