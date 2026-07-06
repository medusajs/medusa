import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createGiftCardsWorkflow } from "@medusajs/loyalty-plugin/workflows"
import {
  ILoyaltyModuleService,
  PluginModule,
} from "@medusajs/loyalty-plugin/types"
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
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())

      await dbUtils.snapshot()
    })

    describe("GET /admin/gift-cards", () => {
      beforeEach(async () => {
        await api.post(
          `/admin/customers`,
          { email: "test@test.com" },
          adminHeaders
        )

        await api.post(
          `/admin/gift-cards`,
          { ...giftCardPayload },
          adminHeaders
        )
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

      it("should create a gift card and an anonymous store credit account for the card", async () => {
        const giftCard = (
          await api.post(
            `/admin/gift-cards?fields=*store_credit_account,*store_credit_account.transactions`,
            { ...giftCardPayload },
            adminHeaders
          )
        ).data.gift_card

        expect(giftCard).toEqual(
          expect.objectContaining({
            status: "redeemed",
            value: 1000,
            currency_code: "USD",
            code: "TEST1",
            store_credit_account: expect.objectContaining({
              currency_code: "USD",
              balance: 1000,
              credits: 1000,
              debits: 0,
              transactions: expect.arrayContaining([
                expect.objectContaining({
                  amount: 1000,
                  type: "credit",
                  reference: "gift_card",
                  reference_id: giftCard.id,
                }),
              ]),
            }),
          })
        )
      })

      it("should not allow duplicate codes", async () => {
        await api.post(`/admin/gift-cards`, giftCardPayload, adminHeaders)

        const { response } = await api
          .post(`/admin/gift-cards`, giftCardPayload, adminHeaders)
          .catch((err) => err)

        expect(response.status).toEqual(400)
      })

      it("should auto-generate a code with the default GIFT prefix and 4 sections", async () => {
        const {
          data: { gift_card },
        } = await api.post(
          `/admin/gift-cards`,
          { currency_code: "USD", value: 500 },
          adminHeaders
        )

        const parts = gift_card.code.split("-")
        expect(parts[0]).toBe("GIFT")
        expect(parts.length - 1).toBe(4)
        parts.slice(1).forEach((section) => expect(section).toHaveLength(4))
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

    describe("createGiftCardsWorkflow", () => {
      it("should run the full workflow and produce a gift card with store credit account", async () => {
        const { result } = await createGiftCardsWorkflow(getContainer()).run({
          input: [{ currency_code: "USD", value: 300, code: "WF-TEST-001" }],
        })

        const [giftCard] = result
        expect(giftCard).toEqual(
          expect.objectContaining({
            code: "WF-TEST-001",
            currency_code: "USD",
            value: 300,
            status: "redeemed",
          })
        )
      })

      it("should auto-generate a code in GIFT-XXXX-XXXX-XXXX-XXXX format when no code is provided", async () => {
        const { result } = await createGiftCardsWorkflow(getContainer()).run({
          input: [{ currency_code: "USD", value: 300 }],
        })

        const [giftCard] = result
        const parts = giftCard.code.split("-")

        expect(parts[0]).toBe("GIFT")
        expect(parts.length - 1).toBe(4)
        parts.slice(1).forEach((section) => expect(section).toHaveLength(4))
      })

      it("should auto-generate a code using configured prefix and sections when plugin options are set", async () => {
        const loyaltyModule = getContainer().resolve<ILoyaltyModuleService>(
          PluginModule.LOYALTY
        )
        const spy = jest
          .spyOn(loyaltyModule, "getOptions")
          .mockResolvedValue({ prefix: "GC", sections: 3 })

        try {
          const { result } = await createGiftCardsWorkflow(getContainer()).run({
            input: [{ currency_code: "USD", value: 300 }],
          })

          const [giftCard] = result
          const parts = giftCard.code.split("-")

          expect(parts[0]).toBe("GC")
          expect(parts.length - 1).toBe(3)
          parts.slice(1).forEach((section) => expect(section).toHaveLength(4))
        } finally {
          spy.mockRestore()
        }
      })
    })
  },
})
