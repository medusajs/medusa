import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/customers/:id/addresses/:address_id", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(
          ModuleRegistrationName.CUSTOMER
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should update a customer address", async () => {
        const customer = await customerModuleService.create({
          first_name: "John",
          last_name: "Doe",
        })

        const address = await customerModuleService.addAddresses({
          customer_id: customer.id,
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
        })

        const response = await api.post(
          `/admin/customers/${customer.id}/addresses/${address.id}?fields=*addresses`,
          {
            first_name: "Jane",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer.addresses).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              first_name: "Jane",
              last_name: "Doe",
            }),
          ])
        )
      })

      it("updates a new address to be default and unsets old one", async () => {
        const customer = await customerModuleService.create({
          first_name: "John",
          last_name: "Doe",
        })
        const [, address] = await customerModuleService.addAddresses([
          {
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            address_1: "Test street 1",
            is_default_shipping: true,
          },
          {
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            address_1: "Test street 2",
          },
        ])

        const response = await api.post(
          `/admin/customers/${customer.id}/addresses/${address.id}`,
          {
            first_name: "jane",
            is_default_shipping: true,
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        const [defaultAddress] = await customerModuleService.listAddresses({
          customer_id: customer.id,
          is_default_shipping: true,
        })

        expect(defaultAddress.first_name).toEqual("jane")
        expect(defaultAddress.address_1).toEqual("Test street 2")
      })

      // do the same as above but for billing address
      it("updates a new address to be default and unsets old one", async () => {
        const customer = await customerModuleService.create({
          first_name: "John",
          last_name: "Doe",
        })
        const [, address] = await customerModuleService.addAddresses([
          {
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            address_1: "Test street 1",
            is_default_billing: true,
          },
          {
            customer_id: customer.id,
            first_name: "John",
            last_name: "Doe",
            address_1: "Test street 2",
          },
        ])

        const response = await api.post(
          `/admin/customers/${customer.id}/addresses/${address.id}`,
          {
            first_name: "jane",
            is_default_billing: true,
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        const [defaultAddress] = await customerModuleService.listAddresses({
          customer_id: customer.id,
          is_default_billing: true,
        })

        expect(defaultAddress.first_name).toEqual("jane")
        expect(defaultAddress.address_1).toEqual("Test street 2")
      })
    })
  },
})
