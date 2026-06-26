import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("GET /store/customers", () => {
      let appContainer
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeAll(async () => {
        appContainer = getContainer()
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await dbUtils.snapshot()
      })

      it("should retrieve auth user's customer", async () => {
        const { customer, jwt } = await createAuthenticatedCustomer(
          api,
          storeHeaders
        )

        const response = await api.get(`/store/customers/me`, {
          headers: { authorization: `Bearer ${jwt}`, ...storeHeaders.headers },
        })

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: customer.id,
            first_name: "John",
            last_name: "Doe",
            email: "tony@start.com",
          })
        )
      })
    })
  },
})
