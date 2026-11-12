import { refreshCartItemsWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  PromotionStatus,
  PromotionType,
} from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"
import { medusaTshirtProduct } from "../../../__fixtures__/product"

jest.setTimeout(100000)

const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

const shippingAddressData = {
  address_1: "test address 1",
  city: "SF",
  country_code: "US",
  province: "CA",
  postal_code: "94016",
}

const CUSTOM_PRICING_CODE = "CUSTOM_PRICING"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    // The hook is registered once; each test opts in by setting this handler,
    // which receives the cart as the registered handler retrieved it.
    let hookHandler:
      | ((input: any, context: any) => Promise<void> | void)
      | undefined

    refreshCartItemsWorkflow.hooks.beforeRefreshingPaymentCollection(
      async ({ input: { cart_id } }, context) => {
        if (!hookHandler) {
          return
        }

        const query = context.container.resolve(ContainerRegistrationKeys.QUERY)
        const {
          data: [cart],
        } = await query.graph({
          entity: "cart",
          fields: [
            "id",
            "customer.id",
            "items.*",
            "items.adjustments.*",
            "items.tax_lines.*",
          ],
          filters: { id: cart_id },
        })

        await hookHandler({ cart }, context)
      }
    )

    describe("refreshCartItemsWorkflow beforeRefreshingPaymentCollection hook", () => {
      let appContainer
      let storeHeaders
      let storeHeadersWithCustomer
      let customer
      let region
      let product
      let salesChannel
      let promotion
      let hookCalls: any[]

      const createCart = async (headers = storeHeaders) =>
        (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
              promo_codes: [promotion.code],
            },
            headers
          )
        ).data.cart

      const recordCalls = () => {
        hookHandler = ({ cart }) => {
          hookCalls.push(cart)
        }
      }

      // Recreates one custom adjustment per line on every refresh and keeps a
      // breakdown on the line metadata, the way a pricing plugin would.
      const applyCustomPricing = () => {
        hookHandler = async ({ cart }, { container }) => {
          const cartModule = container.resolve(Modules.CART)

          await cartModule.addLineItemAdjustments(
            cart.items.map((item) => ({
              item_id: item.id,
              code: CUSTOM_PRICING_CODE,
              amount: 200,
            }))
          )

          await cartModule.updateLineItems(
            cart.items.map((item) => ({
              id: item.id,
              metadata: { pricing_breakdown: { custom: 200 } },
            }))
          )
        }
      }

      beforeEach(async () => {
        appContainer = getContainer()
        hookCalls = []

        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        const result = await createAuthenticatedCustomer(api, storeHeaders, {
          email: "hook@example.com",
        })
        customer = result.customer
        storeHeadersWithCustomer = {
          headers: {
            ...storeHeaders.headers,
            authorization: `Bearer ${result.jwt}`,
          },
        }

        await setupTaxStructure(appContainer.resolve(Modules.TAX))

        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        region = (
          await api.post(
            "/admin/regions",
            {
              name: "US",
              currency_code: "usd",
              countries: ["us"],
              payment_providers: ["pp_system_default"],
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
            { name: "Webshop" },
            adminHeaders
          )
        ).data.sales_channel

        promotion = (
          await api.post(
            `/admin/promotions`,
            {
              code: "PROMO_100",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 100,
                max_quantity: 10,
                currency_code: "usd",
              },
            },
            adminHeaders
          )
        ).data.promotion
      })

      afterEach(() => {
        hookHandler = undefined
      })

      it("runs once the cart has its promotion adjustments and tax lines", async () => {
        const cart = await createCart()
        recordCalls()

        await api.post(
          `/store/carts/${cart.id}/line-items`,
          { variant_id: product.variants[1].id, quantity: 2 },
          storeHeaders
        )

        expect(hookCalls).toHaveLength(1)
        const hookCart = hookCalls[0]
        expect(hookCart.id).toEqual(cart.id)
        expect(hookCart.items).toHaveLength(2)
        for (const item of hookCart.items) {
          expect(item.adjustments).toEqual([
            expect.objectContaining({
              code: "PROMO_100",
              promotion_id: promotion.id,
            }),
          ])
          expect(item.tax_lines).toEqual([
            expect.objectContaining({ code: "CADEFAULT", rate: 5 }),
          ])
        }
      })

      it("fires on add, update and delete line, cart update and customer transfer", async () => {
        const cart = await createCart()
        recordCalls()

        const added = (
          await api.post(
            `/store/carts/${cart.id}/line-items`,
            { variant_id: product.variants[1].id, quantity: 1 },
            storeHeaders
          )
        ).data.cart
        expect(hookCalls).toHaveLength(1)

        const addedItem = added.items.find(
          (item) => item.variant_id === product.variants[1].id
        )

        await api.post(
          `/store/carts/${cart.id}/line-items/${addedItem.id}`,
          { quantity: 3 },
          storeHeaders
        )
        expect(hookCalls).toHaveLength(2)

        await api.delete(
          `/store/carts/${cart.id}/line-items/${addedItem.id}`,
          storeHeaders
        )
        expect(hookCalls).toHaveLength(3)

        await api.post(
          `/store/carts/${cart.id}`,
          { email: "changed@example.com" },
          storeHeaders
        )
        expect(hookCalls).toHaveLength(4)

        await api.post(
          `/store/carts/${cart.id}/customer`,
          {},
          storeHeadersWithCustomer
        )
        expect(hookCalls.length).toBeGreaterThanOrEqual(5)
        expect(hookCalls[hookCalls.length - 1].customer).toEqual(
          expect.objectContaining({ id: customer.id })
        )
      })

      it("keeps the hook's changes in the totals, tax and payment collection", async () => {
        const cart = await createCart()
        applyCustomPricing()

        await api.post(
          `/store/payment-collections`,
          { cart_id: cart.id },
          storeHeaders
        )

        await api.post(
          `/store/carts/${cart.id}/line-items/${cart.items[0].id}`,
          { quantity: 2 },
          storeHeaders
        )

        const updated = (
          await api.get(
            `/store/carts/${cart.id}?fields=+payment_collection.amount`,
            storeHeaders
          )
        ).data.cart

        // 2 x 1500 = 3000, minus 2 x 100 promotion and 200 custom pricing.
        // Tax 5% on 2600 = 130.
        expect(updated.items).toHaveLength(1)
        expect(updated.items[0].adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ code: "PROMO_100", amount: 200 }),
            expect.objectContaining({ code: CUSTOM_PRICING_CODE, amount: 200 }),
          ])
        )
        expect(updated.discount_subtotal).toEqual(400)
        expect(updated.tax_total).toEqual(130)
        expect(updated.total).toEqual(2730)
        expect(updated.payment_collection.amount).toEqual(2730)
      })

      it("keeps the breakdown on the line across the next refresh", async () => {
        const cart = await createCart()
        applyCustomPricing()

        await api.post(
          `/store/carts/${cart.id}/line-items/${cart.items[0].id}`,
          { quantity: 2 },
          storeHeaders
        )

        await api.post(
          `/store/carts/${cart.id}/line-items/${cart.items[0].id}`,
          { quantity: 3 },
          storeHeaders
        )

        const updated = (await api.get(`/store/carts/${cart.id}`, storeHeaders))
          .data.cart

        const customAdjustments = updated.items[0].adjustments.filter(
          (adjustment) => adjustment.code === CUSTOM_PRICING_CODE
        )
        expect(customAdjustments).toHaveLength(1)
        expect(updated.items[0].metadata).toEqual({
          pricing_breakdown: { custom: 200 },
        })
      })

      it("rejects the cart change when the hook throws", async () => {
        const cart = await createCart()
        hookHandler = () => {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "No price available for this customer"
          )
        }

        const { response } = await api
          .post(
            `/store/carts/${cart.id}/line-items`,
            { variant_id: product.variants[1].id, quantity: 1 },
            storeHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        expect(response.data.message).toEqual(
          "No price available for this customer"
        )

        hookHandler = undefined

        const unchanged = (
          await api.get(`/store/carts/${cart.id}`, storeHeaders)
        ).data.cart
        expect(unchanged.items).toHaveLength(1)
        expect(unchanged.items[0].variant_id).toEqual(product.variants[0].id)
      })
    })
  },
})
