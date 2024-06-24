import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /store/customers", () => {
      let appContainer
      beforeAll(async () => {
        appContainer = getContainer()
      })

      it("should retrieve auth user's customer", async () => {
        const { customer, jwt } = await createAuthenticatedCustomer(
          appContainer
        )

        const response = await api.get(`/store/customers/me`, {
          headers: { authorization: `Bearer ${jwt}` },
        })

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: customer.id,
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          })
        )
      })
    })
  },
})
