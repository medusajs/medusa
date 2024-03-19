import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Draft Orders - Admin", () => {
      let appContainer

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should create a draft order", async () => {
        const payload = {
          email: "oli@test.dk",
          shipping_address: "oli-shipping",
          discounts: [{ code: "testytest" }],
          items: [
            {
              variant_id: "test-variant",
              quantity: 2,
              metadata: {},
            },
          ],
          currency_code: "USD",
          customer_id: "oli-test",
          shipping_methods: [
            {
              option_id: "test-option",
            },
          ],
        }

        const response = await api.post(
          "/admin/draft-orders",
          payload,
          adminHeaders
        )
        expect(response.status).toEqual(200)
      })
    })
  },
})
