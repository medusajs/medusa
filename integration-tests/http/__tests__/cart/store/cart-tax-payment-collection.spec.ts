import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { medusaTshirtProduct } from "../../../__fixtures__/product"

jest.setTimeout(100000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

// Ships to US/CA, which the tax fixture taxes at 5%.
const shippingAddressData = {
  address_1: "test address 1",
  city: "SF",
  country_code: "US",
  province: "CA",
  postal_code: "94016",
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer

    describe("Store Carts API - taxes and payment collection", () => {
      let storeHeaders
      let region
      let product
      let salesChannel
      let shippingOption
      let cart

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await setupTaxStructure(appContainer.resolve(Modules.TAX))

        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        // With automatic taxes off, taxes are only calculated when the
        // storefront explicitly calls the calculate-taxes route.
        region = (
          await api.post(
            "/admin/regions",
            {
              name: "US",
              currency_code: "usd",
              countries: ["us"],
              automatic_taxes: false,
            },
            adminHeaders
          )
        ).data.region

        product = (
          await api.post(
            "/admin/products",
            { ...medusaTshirtProduct, shipping_profile_id: shippingProfile.id },
            adminHeaders
          )
        ).data.product

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        const stockLocation = (
          await api.post(
            `/admin/stock-locations`,
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
            { name: `Test-${shippingProfile.id}`, type: "test-type" },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        const fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: `Test-${shippingProfile.id}`,
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

        shippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: `Test shipping option ${fulfillmentSet.id}`,
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
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
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              email: "tony@stark.com",
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cart.id}/shipping-methods`,
          { option_id: shippingOption.id },
          storeHeaders
        )
      })

      // Taxes calculated after the payment session was created used to leave
      // the payment collection at the pre-tax total, letting the customer
      // underpay the order.
      it("should refresh the payment collection when taxes are calculated after a payment session was created", async () => {
        const preTaxCart = (
          await api.get(`/store/carts/${cart.id}`, storeHeaders)
        ).data.cart

        expect(preTaxCart.tax_total).toEqual(0)

        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        expect(paymentCollection.amount).toEqual(preTaxCart.total)

        const paymentSession = (
          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )
        ).data.payment_collection.payment_sessions[0]

        expect(paymentSession.amount).toEqual(preTaxCart.total)

        const taxedCart = (
          await api.post(`/store/carts/${cart.id}/taxes`, {}, storeHeaders)
        ).data.cart

        // Taxes are now applied, so the total went up ...
        expect(taxedCart.tax_total).toBeGreaterThan(0)
        expect(taxedCart.total).toBeGreaterThan(preTaxCart.total)

        // ... and the stale payment session must have been dropped in favor of
        // a payment collection that matches the new total.
        expect(taxedCart.payment_collection).toEqual(
          expect.objectContaining({
            id: paymentCollection.id,
            amount: taxedCart.total,
          })
        )
        expect(
          taxedCart.payment_collection.payment_sessions ?? []
        ).toHaveLength(0)
      })

      it("should not complete a cart whose payment sessions do not cover its total", async () => {
        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        // Simulate a payment session that was locked in at a lower amount than
        // the cart total, regardless of how it got there.
        const cartTotal = (
          await api.get(`/store/carts/${cart.id}`, storeHeaders)
        ).data.cart.total

        const paymentModule: any = appContainer.resolve(Modules.PAYMENT)
        const [session] = await paymentModule.listPaymentSessions({
          payment_collection_id: paymentCollection.id,
        })
        await paymentModule.updatePaymentSession({
          id: session.id,
          amount: cartTotal - 100,
          currency_code: "usd",
          data: session.data ?? {},
        })

        const error = await api
          .post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "The payment sessions of the cart do not cover its total. Refresh the cart's payment collection and try again."
        )
      })

      it("should complete a cart when taxes are calculated before the payment session is created", async () => {
        const taxedCart = (
          await api.post(`/store/carts/${cart.id}/taxes`, {}, storeHeaders)
        ).data.cart

        expect(taxedCart.tax_total).toBeGreaterThan(0)

        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const response = await api.post(
          `/store/carts/${cart.id}/complete`,
          {},
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.type).toEqual("order")
        expect(response.data.order.total).toEqual(taxedCart.total)
      })
    })
  },
})
