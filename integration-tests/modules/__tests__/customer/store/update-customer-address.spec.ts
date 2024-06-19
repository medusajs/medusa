import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ICustomerModuleService } from "@medusajs/types"
import { createAuthenticatedCustomer } from "../../../helpers/create-authenticated-customer"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /store/customers/:id/addresses/:address_id", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(
          ModuleRegistrationName.CUSTOMER
        )
      })

      it("should update a customer address", async () => {
        const { customer, jwt } = await createAuthenticatedCustomer(
          appContainer
        )

        const address = await customerModuleService.createAddresses({
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
          { headers: { authorization: `Bearer ${jwt}` } }
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

        const address = await customerModuleService.createAddresses({
          customer_id: otherCustomer.id,
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
        })

        const response = await api
          .post(
            `/store/customers/me/addresses/${address.id}`,
            { first_name: "Jane" },
            { headers: { authorization: `Bearer ${jwt}` } }
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(404)
      })
    })
  },
})
