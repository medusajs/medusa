import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { PromotionStatus, PromotionType } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("DELETE /store/carts/:id/line-items/:line_id", () => {
      let storeHeaders
      let region
      let salesChannel
      let qualifier
      let gift

      const createProduct = async (title: string) =>
        (
          await api.post(
            "/admin/products",
            {
              title,
              status: "published",
              sales_channels: [{ id: salesChannel.id }],
              options: [{ title: "size", values: ["one"] }],
              variants: [
                {
                  title: `${title} variant`,
                  manage_inventory: false,
                  options: { size: "one" },
                  prices: [{ currency_code: "usd", amount: 100 }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

      beforeEach(async () => {
        const container = getContainer()
        await createAdminUser(dbConnection, adminHeaders, container)
        storeHeaders = generateStoreHeaders({
          publishableKey: await generatePublishableKey(container),
        })

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

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop" },
            adminHeaders
          )
        ).data.sales_channel

        qualifier = await createProduct("Qualifier")
        gift = await createProduct("Gift")

        await api.post(
          "/admin/promotions",
          {
            code: "BUY_X_GET_Y",
            type: PromotionType.BUYGET,
            status: PromotionStatus.ACTIVE,
            is_automatic: true,
            application_method: {
              type: "percentage",
              target_type: "items",
              allocation: "each",
              value: 100,
              max_quantity: 1,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              buy_rules: [
                {
                  attribute: "items.product.id",
                  operator: "eq",
                  values: [qualifier.id],
                },
              ],
              target_rules: [
                {
                  attribute: "items.product.id",
                  operator: "eq",
                  values: [gift.id],
                },
              ],
            },
          },
          adminHeaders
        )
      })

      const createCart = async (items: any[] = []) =>
        (
          await api.post(
            "/store/carts",
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              email: "shopper@test.com",
              items,
            },
            storeHeaders
          )
        ).data.cart

      it("should not delete a line item that belongs to another cart", async () => {
        const cartA = await createCart([
          { variant_id: qualifier.variants[0].id, quantity: 1 },
          { variant_id: gift.variants[0].id, quantity: 1 },
        ])
        expect(cartA.total).toEqual(100)

        const cartB = await createCart()
        const qualifierLine = cartA.items.find(
          (i) => i.product_id === qualifier.id
        )

        const response = await api
          .delete(
            `/store/carts/${cartB.id}/line-items/${qualifierLine.id}`,
            storeHeaders
          )
          .catch((e) => e.response)

        const cartAAfter = (
          await api.get(`/store/carts/${cartA.id}`, storeHeaders)
        ).data.cart

        expect(response.status).toEqual(404)
        expect(response.data.message).toEqual(
          `Line item with id: ${qualifierLine.id} was not found`
        )
        expect(cartAAfter.items).toHaveLength(2)
        expect(cartAAfter.total).toEqual(100)
      })

      it("should delete a line item through its own cart and reprice the cart", async () => {
        const cart = await createCart([
          { variant_id: qualifier.variants[0].id, quantity: 1 },
          { variant_id: gift.variants[0].id, quantity: 1 },
        ])
        const qualifierLine = cart.items.find(
          (i) => i.product_id === qualifier.id
        )

        const response = await api.delete(
          `/store/carts/${cart.id}/line-items/${qualifierLine.id}`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.parent.items).toHaveLength(1)
        expect(response.data.parent.total).toEqual(100)
      })
    })
  },
})
