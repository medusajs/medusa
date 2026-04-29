import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60 * 1000)

const giftCardPayload = {
  currency_code: "USD",
  value: 1000,
  code: "TEST1",
  line_item_id: "lin_123",
}

const giftCardResponse = {
  id: expect.any(String),
  code: "TEST1",
  currency_code: "USD",
  expires_at: null,
  line_item_id: "lin_123",
  status: "redeemed", // cards are automatically redeemed i.e. SCA is created upon creation
  value: 1000,
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
    })

    describe("GET /admin/gift-cards", () => {
      beforeEach(async () => {
        await api.post(
          `/admin/customers`,
          { email: "test@test.com" },
          adminHeaders
        )

        await api.post(`/admin/gift-cards`, { ...giftCardPayload }, adminHeaders)
      })

      it("successfully returns all gift cards", async () => {
        const {
          data: { gift_cards: giftCards },
        } = await api.get(`/admin/gift-cards`, adminHeaders)

        expect(giftCards).toEqual([expect.objectContaining({ code: "TEST1" })])
      })
    })

    describe("GET /admin/gift-cards/:id", () => {
      it("should retrieve a gift card by id", async () => {
        const {
          data: { gift_card: createdGiftCard },
        } = await api.post(`/admin/gift-cards`, giftCardPayload, adminHeaders)

        const {
          data: { gift_card },
        } = await api.get(
          `/admin/gift-cards/${createdGiftCard.id}`,
          adminHeaders
        )

        expect(gift_card).toEqual(expect.objectContaining(giftCardResponse))
      })

      it("should throw an error if the gift card does not exist", async () => {
        const { response } = await api
          .get(`/admin/gift-cards/does-not-exist`, adminHeaders)
          .catch((e) => e)

        expect(response.data).toEqual({
          message: "GiftCard id not found: does-not-exist",
          type: "not_found",
        })
      })
    })

    describe("POST /admin/gift-cards", () => {
      it("successfully creates a gift card", async () => {
        const {
          data: { gift_card },
        } = await api.post(`/admin/gift-cards`, giftCardPayload, adminHeaders)

        expect(gift_card).toEqual(expect.objectContaining(giftCardResponse))
      })
    })

    describe("POST /admin/gift-cards/:id", () => {
      it("should update a gift card by id", async () => {
        const {
          data: { gift_card: createdGiftCard },
        } = await api.post(`/admin/gift-cards`, giftCardPayload, adminHeaders)

        const {
          data: { gift_card },
        } = await api.post(
          `/admin/gift-cards/${createdGiftCard.id}`,
          {
            status: "redeemed",
            note: "This is a test note",
          },
          adminHeaders
        )

        expect(gift_card).toEqual(
          expect.objectContaining({
            status: "redeemed",
            note: "This is a test note",
          })
        )
      })

      it("should throw an error if the gift card does not exist", async () => {
        const { response } = await api
          .post(
            `/admin/gift-cards/does-not-exist`,
            {
              status: "redeemed",
              note: "This is a test note",
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.data).toEqual({
          message: "GiftCard id not found: does-not-exist",
          type: "not_found",
        })
      })
    })
  },
})
