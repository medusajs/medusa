import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, PaymentActions, ProductStatus } from "@medusajs/utils"
import { setTimeout } from "timers/promises"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(100000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

const pendingAuthProviderId = "pp_pending-auth_pending-auth"

const shippingAddressData = {
  address_1: "test address 1",
  address_2: "test address 2",
  city: "SF",
  country_code: "US",
  province: "CA",
  postal_code: "94016",
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer
    let storeHeaders
    let storeHeadersWithCustomer
    let region
    let salesChannel
    let product
    let shippingProfile
    let cart

    beforeAll(async () => {
      appContainer = getContainer()
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      const publishableKey = await generatePublishableKey(appContainer)
      storeHeaders = generateStoreHeaders({ publishableKey })

      const { customer, jwt } = await createAuthenticatedCustomer(
        api,
        storeHeaders
      )
      storeHeadersWithCustomer = {
        headers: {
          ...storeHeaders.headers,
          authorization: `Bearer ${jwt}`,
        },
      }

      region = (
        await api.post(
          "/admin/regions",
          {
            name: "Test Region",
            currency_code: "usd",
            countries: ["US"],
            automatic_taxes: false,
          },
          adminHeaders
        )
      ).data.region

      salesChannel = (
        await api.post(
          "/admin/sales-channels",
          { name: "Test SC", is_disabled: false },
          adminHeaders
        )
      ).data.sales_channel

      shippingProfile = (
        await api.post(
          "/admin/shipping-profiles",
          { name: "Test Profile", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Test Product",
            status: ProductStatus.PUBLISHED,
            options: [{ title: "Size", values: ["S"] }],
            variants: [
              {
                title: "Test Variant",
                sku: "TEST-VARIANT",
                prices: [{ currency_code: "usd", amount: 1500 }],
                options: { Size: "S" },
                manage_inventory: false,
              },
            ],
            sales_channels: [{ id: salesChannel.id }],
            shipping_profile_id: shippingProfile.id,
          },
          adminHeaders
        )
      ).data.product

      // Setup fulfillment infrastructure
      const stockLocation = (
        await api.post(
          "/admin/stock-locations",
          { name: "test location" },
          adminHeaders
        )
      ).data.stock_location

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )

      const fulfillmentSets = (
        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
          { name: "Test Set", type: "test-type" },
          adminHeaders
        )
      ).data.stock_location.fulfillment_sets

      const fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
          {
            name: "Test Zone",
            geo_zones: [{ type: "country", country_code: "US" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
        { add: ["manual_test-provider"] },
        adminHeaders
      )

      const shippingOption = (
        await api.post(
          "/admin/shipping-options",
          {
            name: "Test Shipping",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: "manual_test-provider",
            price_type: "flat",
            type: {
              label: "Test",
              description: "Test",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 1000 }],
            rules: [],
          },
          adminHeaders
        )
      ).data.shipping_option

      cart = (
        await api.post(
          "/store/carts",
          {
            currency_code: "usd",
            sales_channel_id: salesChannel.id,
            region_id: region.id,
            shipping_address: shippingAddressData,
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
          },
          storeHeadersWithCustomer
        )
      ).data.cart

      await api.post(
        `/store/carts/${cart.id}/shipping-methods`,
        { option_id: shippingOption.id },
        storeHeaders
      )
    })

    describe("POST /store/carts/:id/complete with pending_authorization", () => {
      it("should create an order when payment returns pending_authorization", async () => {
        const paymentCollection = (
          await api.post(
            "/store/payment-collections",
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: pendingAuthProviderId },
          storeHeaders
        )

        const completedCart = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data

        // Order should be created despite pending payment
        expect(completedCart.type).toBe("order")
        expect(completedCart.order).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            currency_code: "usd",
            status: "pending",
          })
        )

        const orderId = completedCart.order.id

        // Verify order payment status is "awaiting"
        const order = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status,*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments`,
            adminHeaders
          )
        ).data.order

        expect(order.payment_status).toBe("awaiting")

        // Verify no payment record exists
        const payments = order.payment_collections?.[0]?.payments ?? []
        expect(payments).toHaveLength(0)

        // Verify payment session is in pending_authorization
        const sessions = order.payment_collections?.[0]?.payment_sessions ?? []
        expect(sessions).toHaveLength(1)
        expect(sessions[0].status).toBe("pending_authorization")
      })

      it("should return the same order on idempotent retry", async () => {
        const paymentCollection = (
          await api.post(
            "/store/payment-collections",
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: pendingAuthProviderId },
          storeHeaders
        )

        const firstComplete = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data

        expect(firstComplete.type).toBe("order")

        // Second completion should return same order
        const secondComplete = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data

        expect(secondComplete.type).toBe("order")
        expect(secondComplete.order.id).toBe(firstComplete.order.id)
      })
    })

    describe("POST /admin/orders/:id/payment-sessions/authorize", () => {
      it("should authorize a pending payment session when provider confirms payment", async () => {
        // Complete cart with pending_authorization
        const paymentCollection = (
          await api.post(
            "/store/payment-collections",
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: pendingAuthProviderId },
          storeHeaders
        )

        const completedCart = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data

        expect(completedCart.type).toBe("order")
        const orderId = completedCart.order.id

        // Get the payment session ID
        const orderBefore = (
          await api.get(
            `/admin/orders/${orderId}?fields=*payment_collections,*payment_collections.payment_sessions`,
            adminHeaders
          )
        ).data.order

        const sessionId =
          orderBefore.payment_collections[0].payment_sessions[0].id

        // Simulate payment arriving by updating session data
        const paymentModule = appContainer.resolve(Modules.PAYMENT)
        await paymentModule.updatePaymentSession({
          id: sessionId,
          currency_code: "usd",
          amount: orderBefore.payment_collections[0].amount,
          data: { payment_received: true },
        })

        // Admin triggers authorization
        const authResult = (
          await api.post(
            `/admin/orders/${orderId}/payment-sessions/authorize?fields=+payment_status`,
            { payment_session_id: sessionId },
            adminHeaders
          )
        ).data

        expect(authResult.is_authorized).toBe(true)
        expect(authResult.order).toEqual(
          expect.objectContaining({
            id: orderId,
            payment_status: "authorized",
          })
        )

        // Verify order now has authorized payment status
        const orderAfter = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status,*payment_collections.payments`,
            adminHeaders
          )
        ).data.order

        expect(orderAfter.payment_status).toBe("authorized")
        expect(orderAfter.payment_collections[0].payments).toHaveLength(1)
      })

      it("should return still-pending status when provider has not received payment", async () => {
        const paymentCollection = (
          await api.post(
            "/store/payment-collections",
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: pendingAuthProviderId },
          storeHeaders
        )

        const completedCart = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data

        expect(completedCart.type).toBe("order")
        const orderId = completedCart.order.id

        // Get session and collection IDs
        const order = (
          await api.get(
            `/admin/orders/${orderId}?fields=*payment_collections,*payment_collections.payment_sessions`,
            adminHeaders
          )
        ).data.order

        const sessionId = order.payment_collections[0].payment_sessions[0].id

        // Admin triggers authorization — payment NOT received yet
        // The provider will return pending_authorization again
        const authResult = (
          await api.post(
            `/admin/orders/${orderId}/payment-sessions/authorize?fields=+payment_status`,
            { payment_session_id: sessionId },
            adminHeaders
          )
        ).data

        // Order should still be awaiting
        expect(authResult.is_authorized).toBe(false)
        expect(authResult.order).toEqual(
          expect.objectContaining({
            id: orderId,
            payment_status: "awaiting",
          })
        )

        // Order should still be awaiting
        const orderAfter = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status`,
            adminHeaders
          )
        ).data.order

        expect(orderAfter.payment_status).toBe("awaiting")
      })
    })

    describe("POST /hooks/payment/:provider — webhook authorize for existing order", () => {
      const webhookProviderPath = "pending-auth_pending-auth"

      async function waitForPaymentStatus(
        orderId: string,
        expectedStatus: string,
        maxWaitMs = 10000
      ) {
        const start = Date.now()
        while (Date.now() - start < maxWaitMs) {
          const order = (
            await api.get(
              `/admin/orders/${orderId}?fields=+payment_status`,
              adminHeaders
            )
          ).data.order

          if (order.payment_status === expectedStatus) {
            return order
          }

          await setTimeout(500)
        }

        throw new Error(
          `Timed out waiting for payment_status to become "${expectedStatus}"`
        )
      }

      it("should authorize payment via webhook when order exists with pending_authorization", async () => {
        // 1. Complete cart with pending_authorization provider
        const paymentCollection = (
          await api.post(
            "/store/payment-collections",
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: pendingAuthProviderId },
          storeHeaders
        )

        const completedCart = (
          await api.post(
            `/store/carts/${cart.id}/complete`,
            {},
            storeHeaders
          )
        ).data

        expect(completedCart.type).toBe("order")
        const orderId = completedCart.order.id

        // 2. Get the session ID and verify initial state
        const orderBefore = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status,*payment_collections,*payment_collections.payment_sessions,*payment_collections.payments`,
            adminHeaders
          )
        ).data.order

        expect(orderBefore.payment_status).toBe("awaiting")
        const sessionId =
          orderBefore.payment_collections[0].payment_sessions[0].id
        expect(orderBefore.payment_collections[0].payments).toHaveLength(0)

        // 3. Update session data so provider returns AUTHORIZED on next authorize call
        const paymentModule = appContainer.resolve(Modules.PAYMENT)
        await paymentModule.updatePaymentSession({
          id: sessionId,
          currency_code: "usd",
          amount: orderBefore.payment_collections[0].amount,
          data: { payment_received: true },
        })

        // 4. Send webhook — the provider's getWebhookActionAndData reads the body
        //    and returns the action. The subscriber + processPaymentWorkflow handle the rest.
        const webhookRes = await api.post(
          `/hooks/payment/${webhookProviderPath}`,
          {
            action: PaymentActions.AUTHORIZED,
            session_id: sessionId,
            amount: orderBefore.payment_collections[0].amount,
          }
        )

        expect(webhookRes.status).toBe(200)

        // 5. Wait for async webhook processing and verify payment is authorized
        await waitForPaymentStatus(orderId, "authorized")

        const orderAfter = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status,*payment_collections,*payment_collections.payments`,
            adminHeaders
          )
        ).data.order

        expect(orderAfter.payment_status).toBe("authorized")
        expect(orderAfter.payment_collections[0].payments).toHaveLength(1)
        expect(orderAfter.payment_collections[0].status).toBe("authorized")
      })

      it("should capture payment via webhook when order exists with pending_authorization and action is SUCCESSFUL", async () => {
        // 1. Complete cart with pending_authorization provider
        const paymentCollection = (
          await api.post(
            "/store/payment-collections",
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: pendingAuthProviderId },
          storeHeaders
        )

        const completedCart = (
          await api.post(
            `/store/carts/${cart.id}/complete`,
            {},
            storeHeaders
          )
        ).data

        expect(completedCart.type).toBe("order")
        const orderId = completedCart.order.id

        // 2. Get session ID
        const orderBefore = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status,*payment_collections,*payment_collections.payment_sessions`,
            adminHeaders
          )
        ).data.order

        const sessionId =
          orderBefore.payment_collections[0].payment_sessions[0].id

        // 3. Update session data so provider returns AUTHORIZED
        const paymentModule = appContainer.resolve(Modules.PAYMENT)
        await paymentModule.updatePaymentSession({
          id: sessionId,
          currency_code: "usd",
          amount: orderBefore.payment_collections[0].amount,
          data: { payment_received: true },
        })

        // 4. Send webhook with SUCCESSFUL (autocapture) action
        const webhookRes = await api.post(
          `/hooks/payment/${webhookProviderPath}`,
          {
            action: PaymentActions.SUCCESSFUL,
            session_id: sessionId,
            amount: orderBefore.payment_collections[0].amount,
          }
        )

        expect(webhookRes.status).toBe(200)

        // 5. Wait for async webhook processing and verify payment is captured
        await waitForPaymentStatus(orderId, "captured")

        const orderAfter = (
          await api.get(
            `/admin/orders/${orderId}?fields=+payment_status,*payment_collections,*payment_collections.payments,*payment_collections.payments.captures`,
            adminHeaders
          )
        ).data.order

        expect(orderAfter.payment_status).toBe("captured")
        expect(orderAfter.payment_collections[0].payments).toHaveLength(1)
        expect(
          orderAfter.payment_collections[0].payments[0].captures
        ).toHaveLength(1)
        expect(orderAfter.payment_collections[0].status).toBe("completed")
      })
    })
  },
})
