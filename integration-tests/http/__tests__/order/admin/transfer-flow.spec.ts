import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Transfer Order flow (Admin)", () => {
      let order
      let customer
      let user
      let storeHeaders

      beforeEach(async () => {
        const container = getContainer()

        user = (await createAdminUser(dbConnection, adminHeaders, container))
          .user
        const publishableKey = await generatePublishableKey(container)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const seeders = await createOrderSeeder({ api, container })

        const registeredCustomerToken = (
          await api.post("/auth/customer/emailpass/register", {
            email: "test@email.com",
            password: "password",
          })
        ).data.token

        customer = (
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

        order = seeders.order
      })

      it("should pass order transfer flow from admin successfully", async () => {
        // 1. Admin requests order transfer for a customer with an account
        await api.post(
          `/admin/orders/${order.id}/transfer`,
          {
            customer_id: customer.id,
            update_order_email: true,
          },
          adminHeaders
        )

        const orderResult = (
          await api.get(
            `/admin/orders/${order.id}?fields=+customer_id,+email`,
            adminHeaders
          )
        ).data.order

        // 2. Order still belongs to the guest customer since the transfer hasn't been accepted yet
        expect(orderResult.email).toEqual("tony@stark-industries.com")
        expect(orderResult.customer_id).not.toEqual(customer.id)

        const orderPreviewResult = (
          await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
        ).data.order

        expect(orderPreviewResult).toEqual(
          expect.objectContaining({
            customer_id: customer.id,
            order_change: expect.objectContaining({
              change_type: "transfer",
              status: "requested",
              requested_by: user.id,
            }),
          })
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(1)
        expect(orderChangesResult[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: user.id,
            created_by: user.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: expect.objectContaining({
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                  new_email: "test@email.com",
                }),
              }),
            ]),
          })
        )

        // 3. Guest customer who received the token accepts the transfer
        await api.post(
          `/store/orders/${order.id}/transfer/accept`,
          { token: orderChangesResult[0].actions[0].details.token },
          {
            headers: {
              ...storeHeaders.headers,
            },
          }
        )

        const finalOrderResult = (
          await api.get(
            `/admin/orders/${order.id}?fields=+customer_id,+email`,
            adminHeaders
          )
        ).data.order

        // 4. Customer account is now associated with the order and email is updated to the customer's email
        expect(finalOrderResult.email).toEqual("test@email.com")
        expect(finalOrderResult.customer_id).toEqual(customer.id)
      })

      it("should cancel an order transfer request from admin successfully", async () => {
        await api.post(
          `/admin/orders/${order.id}/transfer`,
          {
            customer_id: customer.id,
          },
          adminHeaders
        )

        await api.get(
          `/admin/orders/${order.id}?fields=+customer_id,+email`,
          adminHeaders
        )

        let orderPreviewResult = (
          await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
        ).data.order

        expect(orderPreviewResult).toEqual(
          expect.objectContaining({
            customer_id: customer.id,
            order_change: expect.objectContaining({
              change_type: "transfer",
              status: "requested",
              requested_by: user.id,
            }),
          })
        )

        await api.post(
          `/admin/orders/${order.id}/transfer/cancel`,
          {},
          adminHeaders
        )

        orderPreviewResult = (
          await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
        ).data.order

        expect(orderPreviewResult.order_change).not.toBeDefined()

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(0)
      })

      it("should fail to request order transfer to a guest customer", async () => {
        const customer = (
          await api.post(
            "/admin/customers",
            {
              first_name: "guest",
              email: "guest@medusajs.com",
            },
            adminHeaders
          )
        ).data.customer

        const err = await api
          .post(
            `/admin/orders/${order.id}/transfer`,
            {
              customer_id: customer.id,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(err.response.status).toBe(400)
        expect(err.response.data).toEqual(
          expect.objectContaining({
            type: "invalid_data",
            message: `Cannot transfer order: ${order.id} to a guest customer account: guest@medusajs.com`,
          })
        )
      })

      it("should fail to accept order transfer with invalid token", async () => {
        await api.post(
          `/admin/orders/${order.id}/transfer`,
          {
            customer_id: customer.id,
          },
          adminHeaders
        )

        const orderChangesResult = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChangesResult.length).toEqual(1)
        expect(orderChangesResult[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: user.id,
            created_by: user.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: expect.objectContaining({
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                }),
              }),
            ]),
          })
        )

        const err = await api
          .post(
            `/store/orders/${order.id}/transfer/accept`,
            { token: "fake-token" },
            {
              headers: {
                ...storeHeaders.headers,
              },
            }
          )
          .catch((e) => e)

        expect(err.response.status).toBe(400)
        expect(err.response.data).toEqual(
          expect.objectContaining({
            type: "not_allowed",
            message: `Invalid token.`,
          })
        )
      })
    })

    describe("Transfer Order flow (Store, self-serve)", () => {
      let order
      let customer
      let storeHeaders
      let signInToken

      beforeEach(async () => {
        const container = getContainer()

        const publishableKey = await generatePublishableKey(container)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const seeders = await createOrderSeeder({ api, container })

        const registeredCustomerToken = (
          await api.post("/auth/customer/emailpass/register", {
            email: "test@email.com",
            password: "password",
          })
        ).data.token

        customer = (
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

        signInToken = (
          await api.post("/auth/customer/emailpass", {
            email: "test@email.com",
            password: "password",
          })
        ).data.token

        order = seeders.order
      })

      it("should pass order transfer flow from storefront successfully", async () => {
        // 1. Customer requests order transfer
        const storeOrder = (
          await api.post(
            `/store/orders/${order.id}/transfer/request?fields=+email,+customer_id`,
            {},
            {
              headers: {
                authorization: `Bearer ${signInToken}`,
                ...storeHeaders.headers,
              },
            }
          )
        ).data.order

        // 2. Order still belongs to the guest customer since the transfer hasn't been accepted yet
        expect(storeOrder.email).toEqual("tony@stark-industries.com")
        expect(storeOrder.customer_id).not.toEqual(customer.id)

        const orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=*actions`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: customer.id,
            created_by: customer.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: {
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                },
              }),
            ]),
          })
        )

        // 3. Guest customer who received the token accepts the transfer
        const finalOrder = (
          await api.post(
            `/store/orders/${order.id}/transfer/accept?fields=+email,+customer_id`,
            { token: orderChanges[0].actions[0].details.token },
            storeHeaders
          )
        ).data.order

        // 4. Customer account is now associated with the order and email is still the original email, since update_order_email is not true on the request
        expect(finalOrder.email).toEqual("tony@stark-industries.com")
        expect(finalOrder.customer_id).toEqual(customer.id)
      })

      it("should cancel a customer transfer request as an admin", async () => {
        await api.post(
          `/store/orders/${order.id}/transfer/request`,
          {},
          {
            headers: {
              authorization: `Bearer ${signInToken}`,
              ...storeHeaders.headers,
            },
          }
        )

        let orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=*actions`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: customer.id,
            created_by: customer.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: expect.objectContaining({
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                }),
              }),
            ]),
          })
        )

        // Admin cancels the transfer request
        await api.post(
          `/admin/orders/${order.id}/transfer/cancel`,
          {},
          adminHeaders
        )

        orderChanges = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChanges.length).toEqual(0)
      })

      it("customer should be able to cancel their own transfer request", async () => {
        await api.post(
          `/store/orders/${order.id}/transfer/request`,
          {},
          {
            headers: {
              authorization: `Bearer ${signInToken}`,
              ...storeHeaders.headers,
            },
          }
        )

        let orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=*actions`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: customer.id,
            created_by: customer.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: expect.objectContaining({
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                }),
              }),
            ]),
          })
        )

        await api.post(
          `/store/orders/${order.id}/transfer/cancel`,
          {},
          {
            headers: {
              authorization: `Bearer ${signInToken}`,
              ...storeHeaders.headers,
            },
          }
        )

        orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=*actions`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(0)
      })

      it("original customer should be able to decline a transfer request", async () => {
        await api.post(
          `/store/orders/${order.id}/transfer/request`,
          {},
          {
            headers: {
              authorization: `Bearer ${signInToken}`,
              ...storeHeaders.headers,
            },
          }
        )

        let orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=*actions`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: customer.id,
            created_by: customer.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: expect.objectContaining({
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                }),
              }),
            ]),
          })
        )

        await api.post(
          `/store/orders/${order.id}/transfer/decline`,
          { token: orderChanges[0].actions[0].details.token },
          {
            headers: {
              ...storeHeaders.headers,
            },
          }
        )

        orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=+declined_at`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "declined",
            requested_by: customer.id,
            created_by: customer.id,
            declined_at: expect.any(String),
          })
        )
      })

      it("shound not decline a transfer request without proper token", async () => {
        await api.post(
          `/store/orders/${order.id}/transfer/request`,
          {},
          {
            headers: {
              authorization: `Bearer ${signInToken}`,
              ...storeHeaders.headers,
            },
          }
        )

        let orderChanges = (
          await api.get(
            `/admin/orders/${order.id}/changes?fields=*actions`,
            adminHeaders
          )
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            requested_by: customer.id,
            created_by: customer.id,
            confirmed_by: null,
            confirmed_at: null,
            declined_by: null,
            actions: expect.arrayContaining([
              expect.objectContaining({
                version: 2,
                action: "TRANSFER_CUSTOMER",
                reference: "customer",
                reference_id: customer.id,
                details: expect.objectContaining({
                  token: expect.any(String),
                  original_email: "tony@stark-industries.com",
                }),
              }),
            ]),
          })
        )

        const error = await api
          .post(
            `/store/orders/${order.id}/transfer/decline`,
            { token: "fake-token" },
            {
              headers: {
                ...storeHeaders.headers,
              },
            }
          )
          .catch((e) => e)

        expect(error.response.status).toBe(400)
        expect(error.response.data).toEqual(
          expect.objectContaining({
            type: "not_allowed",
            message: "Invalid token.",
          })
        )

        orderChanges = (
          await api.get(`/admin/orders/${order.id}/changes`, adminHeaders)
        ).data.order_changes

        expect(orderChanges.length).toEqual(1)
        expect(orderChanges[0]).toEqual(
          expect.objectContaining({
            change_type: "transfer",
            status: "requested",
            declined_at: null,
          })
        )
      })
    })
  },
})
