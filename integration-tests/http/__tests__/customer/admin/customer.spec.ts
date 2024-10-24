import { IAuthModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import jwt from "jsonwebtoken"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let customer1
    let customer2
    let customer3
    let customer4
    let customer5
    let container
    let storeHeaders

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      customer1 = (
        await api.post(
          "/admin/customers",
          {
            email: "test1@email.com",
          },
          adminHeaders
        )
      ).data.customer

      customer2 = (
        await api.post(
          "/admin/customers",
          {
            email: "test2@email.com",
          },
          adminHeaders
        )
      ).data.customer

      customer3 = (
        await api.post(
          "/admin/customers",
          {
            email: "test3@email.com",
          },
          adminHeaders
        )
      ).data.customer

      customer4 = (
        await api.post(
          "/admin/customers",
          {
            email: "test4@email.com",
          },
          adminHeaders
        )
      ).data.customer
    })

    describe("GET /admin/customers", () => {
      it("should list customers and query count", async () => {
        const response = await api
          .get("/admin/customers", adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(4)
        expect(response.data.customers).toEqual([
          expect.objectContaining({
            email: "test1@email.com",
          }),
          expect.objectContaining({
            email: "test2@email.com",
          }),
          expect.objectContaining({
            email: "test3@email.com",
          }),
          expect.objectContaining({
            email: "test4@email.com",
            // BREAKING: You cannot create customers with an account directly. This will happen upon customer registration.
            // has_account: true,
          }),
        ])
      })

      it("should list customers in group and count", async () => {
        const customerGroup = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP",
            },
            adminHeaders
          )
        ).data.customer_group

        await api.post(
          `/admin/customer-groups/${customerGroup.id}/customers`,
          {
            add: [customer1.id, customer2.id, customer3.id],
          },
          adminHeaders
        )

        const response = await api.get(
          `/admin/customers?groups[]=${customerGroup.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(3)
        expect(response.data.customers).toEqual([
          expect.objectContaining({
            id: customer1.id,
          }),
          expect.objectContaining({
            id: customer2.id,
          }),
          expect.objectContaining({
            id: customer3.id,
          }),
        ])
      })

      it("should list customers with specific query", async () => {
        const response = await api.get("/admin/customers?q=est2@", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              email: "test2@email.com",
            }),
          ])
        )
      })

      it("should list customers with expand query", async () => {
        await api.post(
          `/admin/customers/${customer1.id}/addresses`,
          {
            first_name: "Lebron",
            last_name: "James",
          },
          adminHeaders
        )
        // BREAKING: Customers no longer carry shipping_addresses, they have addresses
        const response = await api.get(
          "/admin/customers?q=test1@email.com&fields=*addresses",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customer1.id,
              addresses: expect.arrayContaining([
                expect.objectContaining({
                  first_name: "Lebron",
                  last_name: "James",
                }),
              ]),
            }),
          ])
        )
      })
    })

    describe("POST /admin/customers", () => {
      it("should create a customer", async () => {
        const response = await api.post(
          "/admin/customers",
          {
            first_name: "newf",
            last_name: "newl",
            email: "new@email.com",
            metadata: { foo: "bar" },
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            first_name: "newf",
            last_name: "newl",
            email: "new@email.com",
            metadata: { foo: "bar" },
          })
        )
      })
    })

    describe("POST /admin/customers/:id", () => {
      it("should correctly update customer", async () => {
        const response = await api
          .post(
            `/admin/customers/${customer3.id}`,
            {
              first_name: "newf",
              last_name: "newl",
              email: "new@email.com",
              metadata: { foo: "bar" },
            },
            adminHeaders
          )
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            first_name: "newf",
            last_name: "newl",
            email: "new@email.com",
            metadata: { foo: "bar" },
          })
        )
      })

      // BREAKING: You can no longer update groups on a customer directly. Use dedicated customer groups endpoint
      it("should fail when adding a customer group which doesn't exist", async () => {
        expect.assertions(3)

        await api
          .post(
            "/admin/customer-groups/does-not-exist/customers",
            {
              add: [customer1.id],
            },
            adminHeaders
          )
          .catch((error) => {
            expect(error.response.status).toEqual(404)
            expect(error.response.data.type).toEqual("not_found")
            expect(error.response.data.message).toEqual(
              "You tried to set relationship customer_group_id: does-not-exist, but such entity does not exist"
            )
          })
      })

      // BREAKING: You can no longer update groups on a customer directly. Use dedicated customer groups endpoint
      it("should correctly update customer groups", async () => {
        const customerGroup = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP",
            },
            adminHeaders
          )
        ).data.customer_group

        await api.post(
          `/admin/customer-groups/${customerGroup.id}/customers`,
          {
            add: [customer3.id],
          },
          adminHeaders
        )

        let response = await api.get(
          `/admin/customers/${customer3.id}?fields=*groups`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer.groups).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customerGroup.id,
            }),
          ])
        )

        // Adding a group to a customer with already existing groups.

        const otherCustomerGroup = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "Other VIP",
            },
            adminHeaders
          )
        ).data.customer_group

        await api.post(
          `/admin/customer-groups/${otherCustomerGroup.id}/customers`,
          {
            add: [customer3.id],
          },
          adminHeaders
        )

        response = await api.get(
          `/admin/customers/${customer3.id}?fields=*groups`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer.groups.length).toEqual(2)
        expect(response.data.customer.groups).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customerGroup.id,
            }),
            expect.objectContaining({
              id: otherCustomerGroup.id,
            }),
          ])
        )

        // Remove groups
        await api.post(
          `/admin/customer-groups/${customerGroup.id}/customers`,
          {
            remove: [customer3.id],
          },
          adminHeaders
        )
        await api.post(
          `/admin/customer-groups/${otherCustomerGroup.id}/customers`,
          {
            remove: [customer3.id],
          },
          adminHeaders
        )

        response = await api.get(
          `/admin/customers/${customer3.id}?fields=*groups`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer.groups.length).toEqual(0)
      })
    })

    describe("POST /admin/customers/:id/customer-groups", () => {
      it("should batch add and remove customer to/from customer groups", async () => {
        const group1 = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP 1",
            },
            adminHeaders
          )
        ).data.customer_group

        const group2 = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP 2",
            },
            adminHeaders
          )
        ).data.customer_group

        const group3 = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP 3",
            },
            adminHeaders
          )
        ).data.customer_group

        // Add with cg endpoint so we can test remove
        await api.post(
          `/admin/customer-groups/${group1.id}/customers`,
          {
            add: [customer1.id],
          },
          adminHeaders
        )

        const response = await api.post(
          `/admin/customers/${customer1.id}/customer-groups?fields=groups.id`,
          {
            remove: [group1.id],
            add: [group2.id, group3.id],
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)

        expect(response.data.customer.groups.length).toEqual(2)
        expect(response.data.customer.groups).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: group2.id }),
            expect.objectContaining({ id: group3.id }),
          ])
        )
      })
    })

    describe("GET /admin/customers/:id", () => {
      it("should fetch a customer", async () => {
        const response = await api.get(
          `/admin/customers/${customer1.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: customer1.id,
          })
        )
      })

      it("should fetch a customer with expand query", async () => {
        await api.post(
          `/admin/customers/${customer1.id}/addresses`,
          {
            first_name: "Lebron",
            last_name: "James",
            is_default_billing: true,
          },
          adminHeaders
        )

        // BREAKING: Customers no longer carry billing_address, they have addresses
        const response = await api.get(
          `/admin/customers/${customer1.id}?fields=*addresses,*groups`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer).toEqual(
          expect.objectContaining({
            id: customer1.id,
            addresses: [
              expect.objectContaining({
                is_default_billing: true,
                first_name: "Lebron",
                last_name: "James",
              }),
            ],
            groups: [],
          })
        )
      })
    })

    describe("DELETE /admin/customers/:id", () => {
      it("should delete a customer and update auth identity", async () => {
        const registeredCustomerToken = (
          await api.post("/auth/customer/emailpass/register", {
            email: "test@email.com",
            password: "password",
          })
        ).data.token

        const customer = (
          await api.post(
            "/store/customers",
            {
              email: "test@email.com",
            },
            {
              headers: {
                Authorization: `Bearer ${registeredCustomerToken}`,
                ...storeHeaders.headers,
              },
            }
          )
        ).data.customer

        const response = await api.delete(
          `/admin/customers/${customer.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual(
          expect.objectContaining({
            id: customer.id,
            deleted: true,
            object: "customer",
          })
        )

        const { auth_identity_id } = jwt.decode(registeredCustomerToken)

        const authModule: IAuthModuleService = container.resolve(Modules.AUTH)

        const authIdentity = await authModule.retrieveAuthIdentity(
          auth_identity_id
        )

        expect(authIdentity).toEqual(
          expect.objectContaining({
            id: authIdentity.id,
            app_metadata: expect.not.objectContaining({
              customer_id: expect.any(String),
            }),
          })
        )
      })
    })
  },
})
