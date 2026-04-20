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
    let giftCard
    let product
    let storeHeaders
    let cart
    let cheapVariant, veryCheapVariant, expensiveVariant
    let region, salesChannel

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      const publishableKey = await generatePublishableKey(getContainer())
      storeHeaders = generateStoreHeaders({ publishableKey })

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
              {
                title: "very cheap",
                manage_inventory: false,
                options: {
                  size: "large",
                },
                prices: [{ amount: 200, currency_code: "usd" }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      cheapVariant = product.variants.find((v) => v.title === "cheap")
      expensiveVariant = product.variants.find((v) => v.title === "expensive")
      veryCheapVariant = product.variants.find((v) => v.title === "very cheap")

      giftCard = (
        await api.post(`/admin/gift-cards`, { ...giftCardPayload }, adminHeaders)
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
          items: [{ variant_id: expensiveVariant.id, quantity: 1 }],
        },
        storeHeaders
      )

      cart = cart2
    })

    describe("POST /store/carts/:id/gift-cards", () => {
      it("should successfully add a gift card to a cart", async () => {
        const {
          data: { cart: cartWithGiftCard },
        } = await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard.code },
          storeHeaders
        )

        expect(cartWithGiftCard).toEqual(
          expect.objectContaining({
            total: 400,
            original_total: 800,
            credit_line_total: 400,
            gift_cards: expect.arrayContaining([
              expect.objectContaining({ id: giftCard.id }),
            ]),
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
            ]),
          })
        )

        const giftCard2 = (
          await api.post(
            `/admin/gift-cards`,
            { ...giftCardPayload, code: "TEST-2" },
            adminHeaders
          )
        ).data.gift_card

        const {
          data: { cart: cartWithGiftCard2 },
        } = await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard2.code },
          storeHeaders
        )

        expect(cartWithGiftCard2).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 800,
            credit_line_total: 800,
            gift_cards: expect.arrayContaining([
              expect.objectContaining({ id: giftCard.id }),
              expect.objectContaining({ id: giftCard2.id }),
            ]),
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard2.id,
              }),
            ]),
          })
        )

        // Should not add gift card when total is 0
        const giftCard3 = (
          await api.post(
            `/admin/gift-cards`,
            { ...giftCardPayload, code: "TEST-3" },
            adminHeaders
          )
        ).data.gift_card

        const {
          data: { cart: cartWithGiftCard3 },
        } = await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard3.code },
          storeHeaders
        )

        expect(cartWithGiftCard3.credit_lines).toHaveLength(2)
        expect(cartWithGiftCard3.gift_cards).toHaveLength(2)
        expect(cartWithGiftCard3).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 800,
            credit_line_total: 800,
            gift_cards: expect.arrayContaining([
              expect.objectContaining({ id: giftCard.id }),
              expect.objectContaining({ id: giftCard2.id }),
            ]),
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard2.id,
              }),
            ]),
          })
        )
      })

      it("should throw error when adding a gift card that does not exist", async () => {
        const { response } = await api
          .post(
            `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
            { code: "does-not-exist" },
            storeHeaders
          )
          .catch((err) => err)

        expect(response.data.message).toEqual(
          "Gift card (does-not-exist) not found"
        )
      })
    })

    describe("DELETE /store/carts/:id/gift-cards", () => {
      let giftCard2

      beforeEach(async () => {
        await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard.code },
          storeHeaders
        )

        giftCard2 = (
          await api.post(
            `/admin/gift-cards`,
            { ...giftCardPayload, code: "TEST-2" },
            adminHeaders
          )
        ).data.gift_card

        await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard2.code },
          storeHeaders
        )
      })

      it("should successfully remove a gift card from a cart", async () => {
        const {
          data: { cart: cartWithGiftCard },
        } = await api.delete(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          {
            data: {
              code: giftCard.code,
            },
            ...storeHeaders,
          }
        )

        expect(cartWithGiftCard.gift_cards).toHaveLength(1)
        expect(cartWithGiftCard.credit_lines).toHaveLength(1)
        expect(cartWithGiftCard).toEqual(
          expect.objectContaining({
            total: 400,
            original_total: 800,
            credit_line_total: 400,
            gift_cards: expect.arrayContaining([
              expect.objectContaining({ id: giftCard2.id }),
            ]),
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard2.id,
              }),
            ]),
          })
        )

        const {
          data: { cart: cartWithGiftCard2 },
        } = await api.delete(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          {
            data: {
              code: giftCard2.code,
            },
            ...storeHeaders,
          }
        )

        expect(cartWithGiftCard2).toEqual(
          expect.objectContaining({
            total: 800,
            original_total: 800,
            credit_line_total: 0,
            gift_cards: [],
            credit_lines: [],
          })
        )
      })

      it("should throw error when adding a gift card that does not exist", async () => {
        const { response } = await api
          .delete(
            `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
            {
              data: {
                code: "does-not-exist",
              },
              ...storeHeaders,
            }
          )
          .catch((err) => err)

        expect(response.data.message).toEqual(
          "Gift card (does-not-exist) not found in cart"
        )
      })
    })

    describe("POST /store/carts/:id/line-items/:id", () => {
      let largeGiftCard

      beforeEach(async () => {
        await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard.code },
          storeHeaders
        )

        await api.post(
          `/store/payment-collections`,
          { cart_id: cart.id },
          storeHeaders
        )

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
      })

      it("should refresh gift cards", async () => {
        const {
          data: { cart: cartWithGiftCard },
        } = await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: largeGiftCard.code },
          storeHeaders
        )

        expect(cartWithGiftCard.credit_lines).toHaveLength(2)
        expect(cartWithGiftCard.gift_cards).toHaveLength(2)
        expect(cartWithGiftCard).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 800,
            credit_line_total: 800,
            gift_cards: expect.arrayContaining([
              expect.objectContaining({ id: giftCard.id }),
              expect.objectContaining({ id: largeGiftCard.id }),
            ]),
            payment_collection: expect.objectContaining({
              amount: 0,
            }),
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: largeGiftCard.id,
              }),
            ]),
          })
        )

        const {
          data: { cart: updatedCart },
        } = await api.post(
          `/store/carts/${cart.id}/line-items?fields=+credit_line_total,+gift_cards.id,+gift_cards.code,+payment_collection.id`,
          { quantity: 1, variant_id: cheapVariant.id },
          storeHeaders
        )

        expect(updatedCart.credit_lines).toHaveLength(2)
        expect(updatedCart.gift_cards).toHaveLength(2)
        expect(updatedCart).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 1200,
            credit_line_total: 1200,
            gift_cards: expect.arrayContaining([
              expect.objectContaining({ id: giftCard.id }),
              expect.objectContaining({ id: largeGiftCard.id }),
            ]),
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
              expect.objectContaining({
                amount: 800,
                reference: "gift-card",
                reference_id: largeGiftCard.id,
              }),
            ]),
            payment_collection: expect.objectContaining({
              amount: 0,
            }),
          })
        )
      })
    })

    describe("POST /store/carts/:id/complete", () => {
      let largeGiftCard

      beforeEach(async () => {
        await api.post(
          `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
          { code: giftCard.code },
          storeHeaders
        )

        await api.post(
          `/store/payment-collections`,
          { cart_id: cart.id },
          storeHeaders
        )

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
      })

      it("should debit (anonymous) store credit accounts upon cart completion", async () => {
        const {
          data: { cart: updatedCart },
        } = await api.post(
          `/store/carts/${cart.id}/line-items?fields=+credit_line_total,+gift_cards.id,+gift_cards.code,+payment_collection.id`,
          { quantity: 1, variant_id: cheapVariant.id },
          storeHeaders
        )

        let giftCardWithStoreCreditAccount = (
          await api.get(
            `/store/gift-cards/${giftCard.code}?fields=*store_credit_account`,
            storeHeaders
          )
        ).data.gift_card

        expect(giftCardWithStoreCreditAccount).toEqual(
          expect.objectContaining({
            status: "redeemed",
            code: "TEST1",
            value: 400,
            store_credit_account: expect.objectContaining({
              balance: 400,
              credits: 400,
              debits: 0,
            }),
          })
        )

        expect(updatedCart.credit_lines).toHaveLength(1)
        expect(updatedCart.gift_cards).toHaveLength(1)
        expect(updatedCart).toEqual(
          expect.objectContaining({
            total: 800,
            original_total: 1200,
            credit_line_total: 400,
            payment_collection: expect.objectContaining({
              amount: 800,
            }),
          })
        )

        await api.post(
          `/store/payment-collections/${updatedCart.payment_collection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${updatedCart.id}/complete`,
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
            ]),
          })
        )

        giftCardWithStoreCreditAccount = (
          await api.get(
            `/store/gift-cards/${giftCard.code}?fields=*store_credit_account`,
            storeHeaders
          )
        ).data.gift_card

        expect(giftCardWithStoreCreditAccount).toEqual(
          expect.objectContaining({
            status: "redeemed",
            code: "TEST1",
            value: 400,
            store_credit_account: expect.objectContaining({
              balance: 0,
              credits: 400,
              debits: 400,
            }),
          })
        )
      })

      it("should use multiple gift cards on an order", async () => {
        const gc200 = (
          await api.post(
            `/admin/gift-cards`,
            {
              ...giftCardPayload,
              line_item_id: "lin_2",
              code: "GC200",
              value: 200,
            },
            adminHeaders
          )
        ).data.gift_card

        const gc300 = (
          await api.post(
            `/admin/gift-cards`,
            {
              ...giftCardPayload,
              line_item_id: "lin_1",
              code: "GC300",
              value: 300,
            },
            adminHeaders
          )
        ).data.gift_card

        const gc400 = (
          await api.post(
            `/admin/gift-cards`,
            {
              ...giftCardPayload,
              line_item_id: "lin_3",
              code: "GC400",
              value: 400,
            },
            adminHeaders
          )
        ).data.gift_card

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

        // 1. `TEST1` GIFTCARD IS ALREADY APPLIED WITH VALUE 400

        // 2. APPLY `GC200` GIFTCARD WITH VALUE 200
        await api.post(
          `/store/carts/${cart.id}/gift-cards`,
          { code: gc200.code },
          storeHeaders
        )

        // 3. APPLY `GC300` GIFTCARD PARTIALLY WITH VALUE 200 since total is 800
        await api.post(
          `/store/carts/${cart.id}/gift-cards`,
          { code: gc300.code },
          storeHeaders
        )

        // 4. IGNORE `GC400` GIFTCARD WITH VALUE 400 SINCE THE ENTIRE TOTAL IS CREDITED FROM GIFTCARDS
        await api.post(
          `/store/carts/${cart.id}/gift-cards`,
          { code: gc400.code },
          storeHeaders
        )

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${cart.id}/complete?fields=+credit_line_total,*gift_cards,*gift_cards.store_credit_account`,
          {},
          storeHeaders
        )

        expect(order).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 800,
            credit_line_total: 800,
            gift_cards: [
              expect.objectContaining({
                id: giftCard.id,
                status: "redeemed",
                store_credit_account: expect.objectContaining({
                  balance: 0,
                  credits: 400,
                  debits: 400,
                }),
              }),
              expect.objectContaining({
                id: gc200.id,
                status: "redeemed",
                store_credit_account: expect.objectContaining({
                  balance: 0,
                  credits: 200,
                  debits: 200,
                }),
              }),
              expect.objectContaining({
                id: gc300.id,
                status: "redeemed",
                store_credit_account: expect.objectContaining({
                  balance: 100,
                  credits: 300,
                  debits: 200,
                }),
              }),
            ],
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "gift-card",
                reference_id: gc200.id,
              }),
              expect.objectContaining({
                amount: 200,
                reference: "gift-card",
                reference_id: gc300.id,
              }),
              expect.objectContaining({
                amount: 400,
                reference: "gift-card",
                reference_id: giftCard.id,
              }),
            ]),
          })
        )
      })

      it("should use a gift card across 2 orders correctly", async () => {
        const sharedGiftCard = (
          await api.post(
            `/admin/gift-cards`,
            {
              currency_code: "usd",
              value: 400,
              code: "SHARED-CARD",
              line_item_id: "lin_123",
            },
            adminHeaders
          )
        ).data.gift_card

        const cart1 = (
          await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              items: [{ variant_id: veryCheapVariant.id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

        const paymentCollection1 = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cart1.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/carts/${cart1.id}/gift-cards?fields=+credit_line_total`,
          { code: sharedGiftCard.code },
          storeHeaders
        )

        await api.post(
          `/store/payment-collections/${paymentCollection1.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${cart1.id}/complete`,
          {},
          storeHeaders
        )

        expect(order).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 200,
            credit_line_total: 200,
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "gift-card",
                reference_id: sharedGiftCard.id,
              }),
            ]),
          })
        )

        let giftCardWithStoreCreditAccount = (
          await api.get(
            `/store/gift-cards/${sharedGiftCard.code}?fields=*store_credit_account`,
            storeHeaders
          )
        ).data.gift_card

        expect(giftCardWithStoreCreditAccount).toEqual(
          expect.objectContaining({
            status: "redeemed",
            code: sharedGiftCard.code,
            value: 400,
            store_credit_account: expect.objectContaining({
              balance: 200,
              credits: 400,
              debits: 200,
            }),
          })
        )

        // create the second cart
        const cart2 = (
          await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              items: [{ variant_id: veryCheapVariant.id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

        await api.post(
          `/store/carts/${cart2.id}/gift-cards?fields=+credit_line_total`,
          { code: sharedGiftCard.code },
          storeHeaders
        )

        const paymentCollection2 = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cart2.id },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection2.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        /** SUCCESSFULLY COMPLETE THE SECOND CART */

        const {
          data: { order: order2 },
        } = await api.post(
          `/store/carts/${cart2.id}/complete`,
          {},
          storeHeaders
        )

        expect(order2).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 200,
            credit_line_total: 200,
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "gift-card",
                reference_id: sharedGiftCard.id,
              }),
            ]),
          })
        )

        giftCardWithStoreCreditAccount = (
          await api.get(
            `/store/gift-cards/${sharedGiftCard.code}?fields=*store_credit_account`,
            storeHeaders
          )
        ).data.gift_card

        expect(giftCardWithStoreCreditAccount).toEqual(
          expect.objectContaining({
            status: "redeemed",
            code: sharedGiftCard.code,
            value: 400,
            store_credit_account: expect.objectContaining({
              balance: 0,
              credits: 400,
              debits: 400,
            }),
          })
        )

        const giftCardOrders = (
          await api.get(
            `/admin/gift-cards/${sharedGiftCard.id}/orders`,
            adminHeaders
          )
        ).data.orders

        expect(giftCardOrders).toHaveLength(2)
        expect(giftCardOrders).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: order.id }),
            expect.objectContaining({ id: order2.id }),
          ])
        )

        // create the third cart
        const cart3 = (
          await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              items: [{ variant_id: veryCheapVariant.id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

        // when we try to use a gift card which balance is fully used, it should throw an error
        const { response } = await api
          .post(
            `/store/carts/${cart3.id}/gift-cards?fields=+credit_line_total`,
            { code: sharedGiftCard.code },
            storeHeaders
          )
          .catch((err) => err)

        expect(response.status).toEqual(400)
        expect(response.data.message).toEqual(
          `Gift card (${sharedGiftCard.code}) has no balance`
        )
      })

      it("should throw insufficient funds error when the gift card has insufficient funds", async () => {
        const {
          data: { cart: updatedCart },
        } = await api.post(
          `/store/carts/${cart.id}/line-items?fields=+credit_line_total,+gift_cards.id,+gift_cards.code,+payment_collection.id`,
          { quantity: 5, variant_id: cheapVariant.id },
          storeHeaders
        )

        await api.post(
          `/store/payment-collections/${updatedCart.payment_collection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        const {
          data: { cart: newCart },
        } = await api.post(
          `/store/carts`,
          {
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            items: [{ variant_id: expensiveVariant.id, quantity: 1 }],
          },
          storeHeaders
        )

        const {
          data: { payment_collection: newPaymentCollection },
        } = await api.post(
          `/store/payment-collections`,
          { cart_id: newCart.id },
          storeHeaders
        )

        await api.post(
          `/store/carts/${newCart.id}/gift-cards`,
          { code: giftCard.code },
          storeHeaders
        )

        await api.post(
          `/store/payment-collections/${newPaymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeaders
        )

        await api.post(`/store/carts/${updatedCart.id}/complete`, {}, storeHeaders)

        const { response } = await api
          .post(`/store/carts/${newCart.id}/complete`, {}, storeHeaders)
          .catch((err) => err)

        expect(response.data).toEqual(
          expect.objectContaining({
            message: "Insufficient balance",
          })
        )

        const {
          data: {
            store_credit_accounts: [storeCreditAccount],
          },
        } = await api.get(
          `/admin/store-credit-accounts?customer_id=${cart.customer_id}&currency_code=usd`,
          adminHeaders
        )

        expect(storeCreditAccount).toEqual(
          expect.objectContaining({
            balance: 0,
            credits: 400,
            debits: 400,
          })
        )
      })
    })

    describe("POST /store/carts/:id/gift-cards", () => {
      it("should throw error when adding a gift card that does not exist", async () => {
        const { response } = await api
          .post(
            `/store/carts/${cart.id}/gift-cards?fields=+credit_line_total`,
            { code: "does-not-exist" },
            storeHeaders
          )
          .catch((err) => err)

        expect(response.data.message).toEqual(
          "Gift card (does-not-exist) not found"
        )
      })
    })

    describe("with authenticated customer", () => {
      let storeHeadersWithAuth
      let paymentCollection

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(getContainer())
        const newStoreHeaders = generateStoreHeaders({ publishableKey })

        const user = await createAuthenticatedCustomer(api, newStoreHeaders, {
          email: "main@customer.com",
        })

        storeHeadersWithAuth = {
          ...newStoreHeaders,
          headers: {
            ...newStoreHeaders.headers,
            Authorization: `Bearer ${user.jwt}`,
          },
        }
        customer = user.customer

        const {
          data: { cart: cartWithAuthCustomer },
        } = await api.post(
          `/store/carts`,
          {
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            items: [{ variant_id: expensiveVariant.id, quantity: 1 }],
          },
          storeHeadersWithAuth
        )

        paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: cartWithAuthCustomer.id },
            storeHeadersWithAuth
          )
        ).data.payment_collection

        cart = cartWithAuthCustomer
      })

      it.todo(
        "should not allow unregistered customers to add store credits to a cart"
      )

      it.todo(
        "should throw if adding more credit to the cart than the store account has balance"
      )

      it.todo("should complete cart with store credit and gift card added")

      it("should successfully add a store credits with an amount to a cart", async () => {
        const redeemedGiftCard = (
          await api.get(
            `/store/gift-cards/${giftCard.code}?fields=*store_credit_account`,
            storeHeadersWithAuth
          )
        ).data.gift_card

        // gift cards anonymous account
        expect(redeemedGiftCard).toEqual(
          expect.objectContaining({
            status: "redeemed",
            code: "TEST1",
            value: 400,
            store_credit_account: expect.objectContaining({
              balance: 400,
              credits: 400,
              debits: 0,
            }),
          })
        )

        await api.post(
          `/store/store-credit-accounts/claim`,
          { code: redeemedGiftCard.store_credit_account.code },
          storeHeadersWithAuth
        )

        let customerAccount = (
          await api.get(
            `/admin/store-credit-accounts?customer_id=${customer.id}&currency_code=${giftCard.currency_code}`,
            adminHeaders
          )
        ).data.store_credit_accounts[0]

        expect(customerAccount).toEqual(
          expect.objectContaining({
            currency_code: giftCard.currency_code,
            customer_id: customer.id,
            balance: 400,
            credits: 400,
            debits: 0,
          })
        )

        let {
          data: { cart: cartWithStoreCredits },
        } = await api.post(
          `/store/carts/${cart.id}/store-credits?fields=+credit_line_total`,
          { amount: 200 },
          storeHeadersWithAuth
        )

        expect(cartWithStoreCredits).toEqual(
          expect.objectContaining({
            total: 600,
            original_total: 800,
            credit_line_total: 200,
            gift_cards: [],
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "store-credit",
                reference_id: expect.any(String),
              }),
            ]),
          })
        )

        cartWithStoreCredits = (
          await api.post(
            `/store/carts/${cart.id}/store-credits?fields=+credit_line_total`,
            { amount: 300 },
            storeHeadersWithAuth
          )
        ).data.cart

        // OLD CREDIT LINES ARE REMOVED

        expect(cartWithStoreCredits).toEqual(
          expect.objectContaining({
            total: 500,
            original_total: 800,
            credit_line_total: 300,
            gift_cards: [],
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 300,
                reference: "store-credit",
                reference_id: expect.any(String),
              }),
            ]),
          })
        )

        customerAccount = (
          await api.get(
            `/admin/store-credit-accounts?customer_id=${customer.id}&currency_code=${giftCard.currency_code}`,
            adminHeaders
          )
        ).data.store_credit_accounts[0]

        expect(customerAccount).toEqual(
          expect.objectContaining({
            balance: 400,
            credits: 400, // nothing is debited from the customer account until the cart is completed
            debits: 0,
          })
        )
      })

      it.todo(
        "should only use credit first order if store credits are added to two carts active at the same time"
      )

      it("should throw if adding more credit than the account has balance", async () => {
        const customerAccount = (
          await api.post(
            `/admin/store-credit-accounts`,
            { currency_code: giftCard.currency_code, customer_id: customer.id },
            adminHeaders
          )
        ).data.store_credit_account

        await api.post(
          `/admin/store-credit-accounts/${customerAccount.id}/credit`,
          { amount: 150, note: "Crediting customers account" },
          adminHeaders
        )

        const { response } = await api
          .post(
            `/store/carts/${cart.id}/store-credits`,
            { amount: 700 },
            storeHeadersWithAuth
          )
          .catch((err) => err)

        expect(response.data.message).toEqual(
          "Amount is greater than the store credit account balance"
        )
      })

      it("should handle adding more credit than the total is properly", async () => {
        const customerAccount = (
          await api.post(
            `/admin/store-credit-accounts`,
            {
              currency_code: giftCard.currency_code,
              customer_id: customer.id,
            },
            adminHeaders
          )
        ).data.store_credit_account

        await api.post(
          `/admin/store-credit-accounts/${customerAccount.id}/credit`,
          { amount: 1000, note: "Crediting customers account" },
          adminHeaders
        )

        await api
          .post(
            `/store/carts/${cart.id}/store-credits`,
            { amount: 900 }, // --> CREDIT MORE THAN THE CART TOTAL IS
            storeHeadersWithAuth
          )
          .catch((err) => err)

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeadersWithAuth
        )

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${cart.id}/complete?fields=*credit_lines,+credit_line_total`,
          {},
          storeHeadersWithAuth
        )

        expect(order).toEqual(
          expect.objectContaining({
            total: 0,
            original_total: 800,
            credit_line_total: 800,
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 800,
                reference: "store-credit",
                reference_id: customerAccount.id,
              }),
            ]),
          })
        )

        const accountAfterOrder = (
          await api.get(
            `/store/store-credit-accounts/${customerAccount.id}`,
            storeHeadersWithAuth
          )
        ).data.store_credit_account

        expect(accountAfterOrder).toEqual(
          expect.objectContaining({
            balance: 200,
            credits: 1000,
            debits: 800,
          })
        )
      })

      it("should use store credits to purchase 2 orders", async () => {
        const redeemedGiftCard = (
          await api.get(
            `/store/gift-cards/${giftCard.code}?fields=*store_credit_account`,
            storeHeadersWithAuth
          )
        ).data.gift_card

        await api.post(
          `/store/store-credit-accounts/claim`,
          { code: redeemedGiftCard.store_credit_account.code },
          storeHeadersWithAuth
        )

        let customerAccount = (
          await api.get(
            `/admin/store-credit-accounts?customer_id=${customer.id}&currency_code=${giftCard.currency_code}`,
            adminHeaders
          )
        ).data.store_credit_accounts[0]

        expect(customerAccount).toEqual(
          expect.objectContaining({
            currency_code: giftCard.currency_code,
            customer_id: customer.id,
            balance: 400,
            credits: 400,
            debits: 0,
          })
        )

        let {
          data: { cart: cartWithStoreCredits },
        } = await api.post(
          `/store/carts/${cart.id}/store-credits?fields=+credit_line_total`,
          { amount: 200 },
          storeHeadersWithAuth
        )

        expect(cartWithStoreCredits).toEqual(
          expect.objectContaining({
            total: 600,
            original_total: 800,
            credit_line_total: 200,
            gift_cards: [],
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "store-credit",
                reference_id: customerAccount.id,
              }),
            ]),
          })
        )

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeadersWithAuth
        )

        const {
          data: { order },
        } = await api.post(
          `/store/carts/${cartWithStoreCredits.id}/complete`,
          {},
          storeHeadersWithAuth
        )

        expect(order).toEqual(
          expect.objectContaining({
            total: 600,
            original_total: 800,
            credit_line_total: 200,
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "store-credit",
                reference_id: customerAccount.id,
              }),
            ]),
          })
        )

        customerAccount = (
          await api.get(
            `/store/store-credit-accounts/${customerAccount.id}`,
            storeHeadersWithAuth
          )
        ).data.store_credit_account

        expect(customerAccount).toEqual(
          expect.objectContaining({
            balance: 200,
            credits: 400,
            debits: 200,
          })
        )

        const {
          data: { cart: secondCartWithAuthCustomer },
        } = await api.post(
          `/store/carts`,
          {
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            items: [{ variant_id: expensiveVariant.id, quantity: 1 }],
          },
          storeHeadersWithAuth
        )

        // use the rest of store credits
        await api.post(
          `/store/carts/${secondCartWithAuthCustomer.id}/store-credits?fields=+credit_line_total`,
          { amount: 200 },
          storeHeadersWithAuth
        )

        paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: secondCartWithAuthCustomer.id },
            storeHeadersWithAuth
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          { provider_id: "pp_system_default" },
          storeHeadersWithAuth
        )

        const {
          data: { order: secondOrder },
        } = await api.post(
          `/store/carts/${secondCartWithAuthCustomer.id}/complete`,
          {},
          storeHeadersWithAuth
        )

        expect(secondOrder).toEqual(
          expect.objectContaining({
            total: 600,
            original_total: 800,
            credit_line_total: 200,
            credit_lines: expect.arrayContaining([
              expect.objectContaining({
                amount: 200,
                reference: "store-credit",
                reference_id: customerAccount.id,
              }),
            ]),
          })
        )

        customerAccount = (
          await api.get(
            `/store/store-credit-accounts/${customerAccount.id}`,
            storeHeadersWithAuth
          )
        ).data.store_credit_account

        expect(customerAccount).toEqual(
          expect.objectContaining({
            balance: 0, // rest of the credit is used and balance is 0
            credits: 400,
            debits: 400,
          })
        )
      })
    })
  },
})
