import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import jwt from "jsonwebtoken"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  medusaConfigFile: path.join(
    __dirname,
    "../../__fixtures__/auth-emailpass-actor-association"
  ),
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let container
    let storeHeaders

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      await dbUtils.snapshot()
    })

    const registerCustomer = async (email: string, password: string) => {
      const register = await api.post("/auth/customer/emailpass/register", {
        email,
        password,
      })

      const { customer } = (
        await api.post(
          "/store/customers",
          { email, first_name: "John", last_name: "Doe" },
          {
            headers: {
              authorization: `Bearer ${register.data.token}`,
              ...storeHeaders.headers,
            },
          }
        )
      ).data

      return customer
    }

    describe("Emailpass with requireActorAssociation", () => {
      it("should authenticate a customer on the customer actor type", async () => {
        const customer = await registerCustomer(
          "customer@medusa.js",
          "secret_password"
        )

        const login = await api.post("/auth/customer/emailpass", {
          email: "customer@medusa.js",
          password: "secret_password",
        })

        expect(login.status).toEqual(200)
        expect(jwt.decode(login.data.token)).toEqual(
          expect.objectContaining({
            actor_type: "customer",
            actor_id: customer.id,
          })
        )
      })

      it("should authenticate an admin user on the user actor type", async () => {
        const login = await api.post("/auth/user/emailpass", {
          email: "admin@medusa.js",
          password: "somepassword",
        })

        expect(login.status).toEqual(200)
        expect(jwt.decode(login.data.token)).toEqual(
          expect.objectContaining({
            actor_type: "user",
            actor_id: expect.stringMatching(/^user_/),
          })
        )
      })

      it("should not authenticate a customer identity on the user actor type", async () => {
        await registerCustomer("customer@medusa.js", "secret_password")

        const login = await api
          .post("/auth/user/emailpass", {
            email: "customer@medusa.js",
            password: "secret_password",
          })
          .catch((e) => e.response)

        expect(login.status).toEqual(401)
        expect(login.data.message).toEqual("Authentication failed")
      })

      it("should not authenticate a customer identity on an arbitrary actor type", async () => {
        await registerCustomer("customer@medusa.js", "secret_password")

        const login = await api
          .post("/auth/some-actor/emailpass", {
            email: "customer@medusa.js",
            password: "secret_password",
          })
          .catch((e) => e.response)

        expect(login.status).toEqual(401)
        expect(login.data.message).toEqual("Authentication failed")
      })

      it("should not authenticate an admin identity on the customer actor type", async () => {
        const login = await api
          .post("/auth/customer/emailpass", {
            email: "admin@medusa.js",
            password: "somepassword",
          })
          .catch((e) => e.response)

        expect(login.status).toEqual(401)
        expect(login.data.message).toEqual("Authentication failed")
      })

      it("should return the same error for a wrong password as for an unassociated actor type", async () => {
        const login = await api
          .post("/auth/customer/emailpass", {
            email: "admin@medusa.js",
            password: "wrong_password",
          })
          .catch((e) => e.response)

        expect(login.status).toEqual(401)
        expect(login.data.message).toEqual("Authentication failed")
      })

      it("should still allow registering and resuming an incomplete customer signup", async () => {
        const register = await api.post("/auth/customer/emailpass/register", {
          email: "incomplete@medusa.js",
          password: "secret_password",
        })

        expect(register.status).toEqual(200)

        const login = await api
          .post("/auth/customer/emailpass", {
            email: "incomplete@medusa.js",
            password: "secret_password",
          })
          .catch((e) => e.response)

        expect(login.status).toEqual(401)

        const resumed = await api.post("/auth/customer/emailpass/register", {
          email: "incomplete@medusa.js",
          password: "secret_password",
        })

        expect(resumed.status).toEqual(200)

        const customer = await api.post(
          "/store/customers",
          { email: "incomplete@medusa.js", first_name: "John" },
          {
            headers: {
              authorization: `Bearer ${resumed.data.token}`,
              ...storeHeaders.headers,
            },
          }
        )

        expect(customer.status).toEqual(200)

        const loginAfterSignup = await api.post("/auth/customer/emailpass", {
          email: "incomplete@medusa.js",
          password: "secret_password",
        })

        expect(loginAfterSignup.status).toEqual(200)
        expect(jwt.decode(loginAfterSignup.data.token)).toEqual(
          expect.objectContaining({
            actor_type: "customer",
            actor_id: customer.data.customer.id,
          })
        )
      })
    })
  },
})
