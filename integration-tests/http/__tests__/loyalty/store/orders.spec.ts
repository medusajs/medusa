import { ProductStatus } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"

jest.setTimeout(60 * 1000)

const giftCardPayload = {
  currency_code: "usd",
  value: 400,
  code: "TEST1",
  line_item_id: "lin_123",
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let customer
    let giftCard, largeGiftCard
    let product
    let storeHeaders, anonymousHeaders
    let cart
    let cheapVariant, expensiveVariant
    let region, salesChannel

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      const publishableKey = await generatePublishableKey(getContainer())
      storeHeaders = generateStoreHeaders({ publishableKey })
      anonymousHeaders = generateStoreHeaders({ publishableKey })

      const user = await createAuthenticatedCustomer(api, storeHeaders, {
        email: "initial@customer.com",
      })

      product = (
        await api.post(
          `/admin/products`,
          {
            title: "test product 1",
            status: ProductStatus.PUBLISHED,
            options: [{ title: "size", values: ["large", "small"] }],
            variants: [
              {
                title: "expensive",
                manage_inventory: false,
                options: {
                  size: "large",
                },
                prices: [{ amount: 800, currency_code: "usd" }],
              },
              {
                title: "cheap",
                manage_inventory: false,
                options: {
                  size: "large",
                },
                prices: [{ amount: 400, currency_code: "usd" }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      await api.post(
        "/admin/product-types",
        { value: "GiftCard" },
        adminHeaders
      )

      cheapVariant = product.variants.find((v) => v.title === "cheap")
      expensiveVariant = product.variants.find((v) => v.title === "expensive")

      storeHeaders.headers["Authorization"] = `Bearer ${user.jwt}`
      customer = user.customer

      giftCard = (
        await api.post(`/admin/gift-cards`, { ...giftCardPayload }, adminHeaders)
      ).data.gift_card

      largeGiftCard = (
        await api.post(
          `/admin/gift-cards`,
          {
            ...giftCardPayload,
            code: "LARGE",
            value: 1000,
          },
          adminHeaders
        )
      ).data.gift_card

      salesChannel = (
        await api.post(
          `/admin/sales-channels`,
          { name: "test-sales-channel" },
          adminHeaders
        )
      ).data.sales_channel

      region = (
        await api.post(
          "/admin/regions",
          {
            name: "test-region",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region

      const {
        data: { cart: cart2 },
      } = await api.post(
        `/store/carts`,
        {
          region_id: region.id,
          sales_channel_id: salesChannel.id,
          items: [{ variant_id: expensiveVariant.id, quantity: 10 }],
        },
        storeHeaders
      )

      cart = cart2

      await api.post(
        `/store/carts/${cart.id}/gift-cards`,
        { code: giftCard.code },
        storeHeaders
      )

      await api.post(
        `/store/carts/${cart.id}/gift-cards`,
        { code: largeGiftCard.code },
        storeHeaders
      )

      const {
        data: { payment_collection },
      } = await api.post(
        `/store/payment-collections`,
        { cart_id: cart.id },
        storeHeaders
      )

      await api.post(
        `/store/payment-collections/${payment_collection.id}/payment-sessions`,
        { provider_id: "pp_system_default" },
        storeHeaders
      )
    })

    describe("POST /store/orders/:id/credit-lines", () => {
      it("should throw if refund is issued for a non-registered customer", async () => {
        const guestCart = (
          await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              items: [{ variant_id: expensiveVariant.id, quantity: 2 }],
            },
            anonymousHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${guestCart.id}`,
          { email: "anoncustomer@test.com" },
          anonymousHeaders
        )

        await api.post(
          `/store/carts/${guestCart.id}/gift-cards`,
          { code: largeGiftCard.code },
          anonymousHeaders
        )

        const {
          data: { payment_collection },
        } = await api.post(
          `/store/payment-collections`,
          { cart_id: guestCart.id },
          anonymousHeaders
        )

        await api.post(
          `/store/payment-collections/${payment_collection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          anonymousHeaders
        )

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${guestCart.id}/complete`,
          {},
          anonymousHeaders
        )

        await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const item = order.items[0]

        await api.post(
          `/admin/order-edits/${order.id}/items/item/${item.id}`,
          { quantity: 1 },
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/request`,
          {},
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/confirm`,
          {},
          adminHeaders
        )

        const reponse = await api
          .post(
            `/admin/orders/${order.id}/credit-lines`,
            {
              amount: -200,
              reference: "order",
              reference_id: order.id,
            },
            adminHeaders
          )
          .catch((err) => err.response)

        expect(reponse.status).toEqual(400)
        expect(reponse.data.message).toEqual(
          "Store credit refunds can only be issued to registered customers"
        )
      })

      it("should refund to customers store credit account upon credit line refunds", async () => {
        let customerAccounts = (
          await api.get(
            `/admin/store-credit-accounts?customer_id=${customer.id}&currency_code=usd`,
            adminHeaders
          )
        ).data.store_credit_accounts

        expect(customerAccounts.length).toEqual(0)

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${cart.id}/complete`,
          {},
          storeHeaders
        )

        expect(order).toEqual(
          expect.objectContaining({
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 1000,
                reference: "gift-card",
                reference_id: largeGiftCard.id,
              }),
            ]),
          })
        )

        await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const item = order.items[0]

        await api.post(
          `/admin/order-edits/${order.id}/items/item/${item.id}`,
          { quantity: 0 },
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/request`,
          {},
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/confirm`,
          {},
          adminHeaders
        )

        await api.get(`/admin/orders/${order.id}`, adminHeaders)

        const {
          data: { order: order2 },
        } = await api.post(
          `/admin/orders/${order.id}/credit-lines`,
          {
            amount: -106,
            reference: "order",
            reference_id: order.id,
          },
          adminHeaders
        )

        expect(order2).toEqual(
          expect.objectContaining({
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 1000,
                reference: "gift-card",
                reference_id: largeGiftCard.id,
              }),
              expect.objectContaining({
                amount: -106,
                reference: "order",
                reference_id: order.id,
              }),
            ]),
          })
        )

        customerAccounts = (
          await api.get(
            `/admin/store-credit-accounts?customer_id=${customer.id}&currency_code=usd&fields=*transactions`,
            adminHeaders
          )
        ).data.store_credit_accounts

        // as part of the refund a customer store credit account was created
        expect(customerAccounts.length).toEqual(1)

        expect(customerAccounts[0]).toEqual(
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer.id,
            balance: 106,
            credits: 106,
            debits: 0,
            transactions: expect.arrayContaining([
              expect.objectContaining({
                amount: 106,
                type: "credit",
                reference: "order",
                reference_id: order.id,
              }),
            ]),
          })
        )

        const {
          data: { order: order3 },
        } = await api.post(
          `/admin/orders/${order.id}/credit-lines`,
          {
            amount: -1200,
            reference: "order",
            reference_id: order.id,
          },
          adminHeaders
        )

        expect(order3).toEqual(
          expect.objectContaining({
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 1000,
                reference: "gift-card",
                reference_id: largeGiftCard.id,
              }),
              expect.objectContaining({
                amount: -106,
                reference: "order",
                reference_id: order.id,
              }),
              expect.objectContaining({
                amount: -1200,
                reference: "order",
                reference_id: order.id,
              }),
            ]),
          })
        )

        customerAccounts = (
          await api.get(
            `/admin/store-credit-accounts?customer_id=${customer.id}&currency_code=usd&fields=*transactions`,
            adminHeaders
          )
        ).data.store_credit_accounts

        // now the customer account is updated
        expect(customerAccounts.length).toEqual(1)

        expect(customerAccounts[0]).toEqual(
          expect.objectContaining({
            currency_code: "usd",
            customer_id: customer.id,
            balance: 106 + 1200,
            credits: 106 + 1200,
            debits: 0,
            transactions: expect.arrayContaining([
              expect.objectContaining({
                amount: 106,
                type: "credit",
                reference: "order",
                reference_id: order.id,
              }),
              expect.objectContaining({
                amount: 1200,
                type: "credit",
                reference: "order",
                reference_id: order2.id,
              }),
            ]),
          })
        )
      })
    })
  },
})
