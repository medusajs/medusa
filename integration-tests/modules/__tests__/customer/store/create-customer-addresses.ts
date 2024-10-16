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
    describe("POST /store/customers/me/addresses", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(Modules.CUSTOMER)
      })

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
      })

      it("should create a customer address", async () => {
        const { customer, jwt } = await createAuthenticatedCustomer(
          appContainer
        )

        const response = await api.post(
          `/store/customers/me/addresses`,
          {
            first_name: "John",
            last_name: "Doe",
            address_1: "Test street 1",
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
            id: expect.any(String),
            first_name: "John",
            last_name: "Doe",
            address_1: "Test street 1",
            customer_id: customer.id,
          })
        )

        const customerWithAddresses =
          await customerModuleService.retrieveCustomer(customer.id, {
            relations: ["addresses"],
          })

        expect(customerWithAddresses.addresses?.length).toEqual(1)
      })
    })
  },
})
