import { MedusaContainer } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let appContainer: MedusaContainer
    let storeHeaders

    beforeEach(async () => {
      appContainer = getContainer()
      const publishableKey = await generatePublishableKey(appContainer)
      storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("POST /store/customers", () => {
      it("should fails to create a customer without an identity", async () => {
        const customer = await api
          .post(
            "/store/customers",
            {
              email: "newcustomer@medusa.js",
              first_name: "John",
              last_name: "Doe",
            },
            storeHeaders
          )
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
            metadata: {
              loyalty_level: "gold",
              preferences: {
                newsletter: true,
              },
            },
          },
          {
            headers: {
              authorization: `Bearer ${signup.data.token}`,
              ...storeHeaders.headers,
            },
          }
        )

        expect(customer.status).toEqual(200)
        expect(customer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
            has_account: true,
            metadata: {
              loyalty_level: "gold",
              preferences: {
                newsletter: true,
              },
            },
          }),
        })
      })

      it("should successfully create a customer with an identity even if the email is already taken by a non-registered customer", async () => {
        const nonRegisteredCustomer = await api.post(
          "/admin/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          },
          adminHeaders
        )

        expect(nonRegisteredCustomer.status).toEqual(200)
        expect(nonRegisteredCustomer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
            has_account: false,
          }),
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
              ...storeHeaders.headers,
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

      it("should fail to create a customer with an identity when the email is already taken by a registered customer", async () => {
        const firstSignup = await api.post(
          "/auth/customer/emailpass/register",
          {
            email: "newcustomer@medusa.js",
            password: "secret_password",
          }
        )

        expect(firstSignup.status).toEqual(200)
        expect(firstSignup.data).toEqual({ token: expect.any(String) })

        await api.post(
          "/store/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          },
          {
            headers: {
              authorization: `Bearer ${firstSignup.data.token}`,
              ...storeHeaders.headers,
            },
          }
        )

        const firstSignin = await api.post("/auth/customer/emailpass", {
          email: "newcustomer@medusa.js",
          password: "secret_password",
        })

        const customer = await api
          .post(
            "/store/customers",
            {
              email: "newcustomer@medusa.js",
              first_name: "Jane",
              last_name: "Doe",
            },
            {
              headers: {
                authorization: `Bearer ${firstSignin.data.token}`,
                ...storeHeaders.headers,
              },
            }
          )
          .catch((e) => e)

        expect(customer.response.status).toEqual(400)
        expect(customer.response.data.message).toEqual(
          "Request already authenticated as a customer."
        )
      })

      describe("With ensurePublishableApiKey middleware", () => {
        it("should fail when no publishable key is passed in the header", async () => {
          const { response } = await api
            .post(
              "/store/customers",
              {
                email: "newcustomer@medusa.js",
                first_name: "John",
                last_name: "Doe",
              },
              {
                headers: {},
              }
            )
            .catch((e) => e)

          expect(response.data).toEqual({
            message:
              "Publishable API key required in the request header: x-publishable-api-key. You can manage your keys in settings in the dashboard.",
            type: "not_allowed",
          })
        })

        it("should fail when publishable keys are invalid", async () => {
          const { response } = await api
            .post(
              "/store/customers",
              {
                email: "newcustomer@medusa.js",
                first_name: "John",
                last_name: "Doe",
              },
              {
                headers: {
                  "x-publishable-api-key": ["test1", "test2"],
                },
              }
            )
            .catch((e) => e)

          expect(response.data).toEqual({
            message:
              "A valid publishable key is required to proceed with the request",
            type: "not_allowed",
          })
        })
      })
    })
  },
})
