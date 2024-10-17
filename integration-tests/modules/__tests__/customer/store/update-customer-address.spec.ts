import { ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /store/customers/:id/addresses/:address_id", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(Modules.CUSTOMER)
      })

      beforeEach(async () => {
        appContainer = getContainer()
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
      })

      it.only("should update a customer address", async () => {
        const { customer, jwt } = await createAuthenticatedCustomer(
          appContainer
        )

        const address = await customerModuleService.createCustomerAddresses({
          customer_id: customer.id,
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
        })

        const response = await api.post(
          `/store/customers/me/addresses/${address.id}`,
          {
            first_name: "Jane",
          },
          {
            headers: {
              authorization: `Bearer ${jwt}`,
              ...storeHeaders.headers,
            },
          }
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer.addresses[0]).toEqual(
          expect.objectContaining({
            id: address.id,
            first_name: "Jane",
            last_name: "Doe",
          })
        )
      })

      it("should fail to update another customer's address", async () => {
        const { jwt } = await createAuthenticatedCustomer(appContainer)

        const otherCustomer = await customerModuleService.createCustomers({
          first_name: "Jane",
          last_name: "Doe",
        })

        const address = await customerModuleService.createCustomerAddresses({
          customer_id: otherCustomer.id,
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
        })

        const response = await api
          .post(
            `/store/customers/me/addresses/${address.id}`,
            { first_name: "Jane" },
            {
              headers: {
                authorization: `Bearer ${jwt}`,
                ...storeHeaders.headers,
              },
            }
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(404)
      })
    })
  },
})
