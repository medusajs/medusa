import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

import { ICustomerModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

const { medusaIntegrationTestRunner } = require("medusa-test-utils")

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {
    MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/customers", () => {
      let appContainer
      let shutdownServer
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

      it("should get all customers and its count", async () => {
        await customerModuleService.create([
          {
            first_name: "Test",
            last_name: "Test",
            email: "test@me.com",
          },
        ])

        const response = await api.get(`/admin/customers`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customers).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            first_name: "Test",
            last_name: "Test",
            email: "test@me.com",
          }),
        ])
      })

      it("should get all customers in specific customer group and its count", async () => {
        const vipGroup = await customerModuleService.createCustomerGroup({
          name: "VIP",
        })

        const [john] = await customerModuleService.create([
          {
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
          },
          {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
          },
        ])

        await customerModuleService.addCustomerToGroup({
          customer_id: john.id,
          customer_group_id: vipGroup.id,
        })

        const response = await api.get(
          `/admin/customers?limit=20&offset=0&groups%5B0%5D=${vipGroup.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customers).toEqual([
          expect.objectContaining({
            first_name: "John",
            last_name: "Doe",
            email: "john.doe@example.com",
          }),
        ])
      })

      it("should filter customers by last name", async () => {
        await customerModuleService.create([
          {
            first_name: "Jane",
            last_name: "Doe",
            email: "jane@me.com",
          },
          {
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          },
          {
            first_name: "LeBron",
            last_name: "James",
            email: "lebron@me.com",
          },
          {
            first_name: "John",
            last_name: "Silver",
            email: "johns@me.com",
          },
        ])

        const response = await api.get(
          `/admin/customers?last_name=Doe`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(2)
        expect(response.data.customers).toContainEqual(
          expect.objectContaining({
            id: expect.any(String),
            first_name: "Jane",
            last_name: "Doe",
            email: "jane@me.com",
          })
        )
        expect(response.data.customers).toContainEqual(
          expect.objectContaining({
            id: expect.any(String),
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          })
        )
      })

      it("should support searching of customers", async () => {
        await customerModuleService.create([
          {
            first_name: "Jane",
            last_name: "Doe",
            email: "jane@me.com",
          },
          {
            first_name: "John",
            last_name: "Doe",
            email: "john@me.com",
          },
          {
            first_name: "LeBron",
            last_name: "James",
            email: "lebron@me.com",
          },
        ])

        const response = await api.get(`/admin/customers?q=do`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.customers).toHaveLength(2)
        expect(response.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              first_name: "Jane",
              last_name: "Doe",
            }),
            expect.objectContaining({
              first_name: "John",
              last_name: "Doe",
            }),
          ])
        )
      })
    })
  },
})
