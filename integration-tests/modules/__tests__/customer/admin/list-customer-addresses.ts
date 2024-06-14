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
    describe("GET /admin/customers/:id/addresses", () => {
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

      it("should get all customer addresses and its count", async () => {
        const [customer] = await customerModuleService.createCustomers([
          {
            first_name: "Test",
            last_name: "Test",
            email: "test@me.com",
            addresses: [
              {
                first_name: "Test",
                last_name: "Test",
                address_1: "Test street 1",
              },
              {
                first_name: "Test",
                last_name: "Test",
                address_1: "Test street 2",
              },
              {
                first_name: "Test",
                last_name: "Test",
                address_1: "Test street 3",
              },
            ],
          },
          {
            first_name: "Test Test",
            last_name: "Test Test",
            addresses: [
              {
                first_name: "Test TEST",
                last_name: "Test TEST",
                address_1: "NOT street 1",
              },
            ],
          },
        ])

        const response = await api.get(
          `/admin/customers/${customer.id}/addresses`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(3)
        expect(response.data.addresses).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              customer_id: customer.id,
              address_1: "Test street 1",
            }),
            expect.objectContaining({
              id: expect.any(String),
              customer_id: customer.id,
              address_1: "Test street 2",
            }),
            expect.objectContaining({
              id: expect.any(String),
              customer_id: customer.id,
              address_1: "Test street 3",
            }),
          ])
        )
      })

      it("should support searching through the addresses", async () => {
        const [customer] = await customerModuleService.createCustomers([
          {
            first_name: "Test",
            last_name: "Test",
            email: "test@me.com",
            addresses: [
              {
                first_name: "John",
                last_name: "Doe",
                address_1: "Huntingdon 123",
              },
              {
                first_name: "Jane",
                last_name: "Doe",
                address_1: "Horseshoe 555",
              },
              {
                first_name: "Jack",
                last_name: "Doe",
                address_1: "Hawkins 12",
              },
            ],
          },
        ])

        const response = await api.get(
          `/admin/customers/${customer.id}/addresses?q=12`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.addresses).toHaveLength(2)
        expect(response.data.addresses).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              address_1: "Huntingdon 123",
            }),
            expect.objectContaining({
              id: expect.any(String),
              address_1: "Hawkins 12",
            }),
          ])
        )
      })
    })
  },
})
