import { deleteCustomerAddressesWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ICustomerModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("deleteCustomerAddressesWorkflow", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService
      let failAddressesDeleted = false

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(Modules.CUSTOMER)

        deleteCustomerAddressesWorkflow.hooks.addressesDeleted(() => {
          if (failAddressesDeleted) {
            throw new Error("addressesDeleted hook failed")
          }
        })
      })

      afterEach(() => {
        failAddressesDeleted = false
      })

      it("should restore the deleted addresses when the workflow fails after deleting them", async () => {
        const customer = await customerModuleService.createCustomers({
          first_name: "John",
          last_name: "Doe",
        })

        const address = await customerModuleService.createCustomerAddresses({
          customer_id: customer.id,
          first_name: "John",
          last_name: "Doe",
          address_1: "Test street 1",
        })

        failAddressesDeleted = true

        const { errors } = await deleteCustomerAddressesWorkflow(
          appContainer
        ).run({
          input: { ids: [address.id] },
          throwOnError: false,
        })

        expect(errors[0].error.message).toBe("addressesDeleted hook failed")

        const addresses = await customerModuleService.listCustomerAddresses({
          id: address.id,
        })

        expect(addresses).toEqual([
          expect.objectContaining({
            id: address.id,
            customer_id: customer.id,
            address_1: "Test street 1",
          }),
        ])
      })
    })
  },
})
