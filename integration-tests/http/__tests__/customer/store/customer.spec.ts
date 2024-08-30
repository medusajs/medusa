import { MedusaContainer } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let appContainer: MedusaContainer

    beforeEach(async () => {
      appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("POST /admin/customers", () => {
      it("should fails to create a customer without an identity", async () => {
        const customer = await api
          .post("/store/customers", {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          })
          .catch((e) => e)

        expect(customer.response.status).toEqual(401)
      })

      it("should successfully create a customer with an identity", async () => {
        const signup = await api.post("/auth/customer/emailpass/register", {
          email: "newcustomer@medusa.js",
          password: "secret_password",
        })

        expect(signup.status).toEqual(200)
        expect(signup.data).toEqual({ token: expect.any(String) })

        const customer = await api.post(
          "/store/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          },
          {
            headers: {
              authorization: `Bearer ${signup.data.token}`,
            },
          }
        )

        expect(customer.status).toEqual(200)
        expect(customer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
          }),
        })

        expect(customer.status).toEqual(200)
        expect(customer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
            has_account: true,
          }),
        })
      })

      it("should successfully create a customer with an identity even if the email is already taken by a non-registered customer", async () => {
        const customerService = appContainer.resolve(
          ModuleRegistrationName.CUSTOMER
        )
        // Can't create a customer via the Rest API, so will have to use the module here
        await customerService.createCustomers({
          email: "newcustomer@medusa.js",
          first_name: "John",
          last_name: "Doe",
        })

        const signup = await api.post("/auth/customer/emailpass/register", {
          email: "newcustomer@medusa.js",
          password: "secret_password",
        })

        expect(signup.status).toEqual(200)
        expect(signup.data).toEqual({ token: expect.any(String) })

        const customer = await api.post(
          "/store/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "Jane",
            last_name: "Doe",
          },
          {
            headers: {
              authorization: `Bearer ${signup.data.token}`,
            },
          }
        )

        expect(customer.status).toEqual(200)
        expect(customer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "Jane",
            last_name: "Doe",
            has_account: true,
          }),
        })

        // Check that customers co-exist
        const customers = await api.get("/admin/customers", adminHeaders)

        expect(customers.status).toEqual(200)
        expect(customers.data.customers).toHaveLength(2)
        expect(customers.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              first_name: "Jane",
              last_name: "Doe",
              email: "newcustomer@medusa.js",
              has_account: true,
            }),
            expect.objectContaining({
              first_name: "John",
              last_name: "Doe",
              email: "newcustomer@medusa.js",
              has_account: false,
            }),
          ])
        )
      })
    })
  },
})
