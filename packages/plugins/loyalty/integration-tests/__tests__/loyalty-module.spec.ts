import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { PluginModule } from "../../src/types"
import { ILoyaltyModuleService } from "../../src/types"
import { GiftCardStatus } from "../../src/types"
import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createGiftCardsStep,
  CreateGiftCardsStepInput,
} from "../../src/workflows/gift-cards/steps/create-gift-cards"

// Minimal workflow wrapping only createGiftCardsStep so it can run
// without the store credit / link dependencies the full workflow requires.
const createGiftCardsTestWorkflow = createWorkflow(
  "test-create-gift-cards",
  (input: CreateGiftCardsStepInput) => {
    return new WorkflowResponse(createGiftCardsStep(input))
  }
)

jest.setTimeout(30000)

moduleIntegrationTestRunner<ILoyaltyModuleService>({
  moduleName: PluginModule.LOYALTY,
  resolve: __dirname + "/../../src/modules/loyalty",
  testSuite: ({ service }) => {
    describe("LoyaltyModuleService", () => {
      describe("GiftCard", () => {
        it("should create a gift card", async () => {
          const giftCard = await service.createGiftCards({
            value: 100,
            currency_code: "usd",
            code: "GIFT-TEST-0001",
          })

          expect(giftCard).toEqual(
            expect.objectContaining({
              id: expect.stringMatching(/^gcard_/),
              value: 100,
              currency_code: "usd",
              code: "GIFT-TEST-0001",
              status: GiftCardStatus.PENDING,
            })
          )
        })

        it("should retrieve a gift card by id", async () => {
          const created = await service.createGiftCards({
            value: 50,
            currency_code: "eur",
            code: "GIFT-TEST-0002",
          })

          const retrieved = await service.retrieveGiftCard(created.id)

          expect(retrieved).toEqual(
            expect.objectContaining({
              id: created.id,
              value: 50,
              currency_code: "eur",
              code: "GIFT-TEST-0002",
            })
          )
        })

        it("should list gift cards", async () => {
          await service.createGiftCards([
            { value: 10, currency_code: "usd", code: "GIFT-LIST-0001" },
            { value: 20, currency_code: "usd", code: "GIFT-LIST-0002" },
          ])

          const giftCards = await service.listGiftCards({
            currency_code: "usd",
          })

          expect(giftCards.length).toBeGreaterThanOrEqual(2)
          expect(giftCards).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ code: "GIFT-LIST-0001" }),
              expect.objectContaining({ code: "GIFT-LIST-0002" }),
            ])
          )
        })

        it("should update a gift card", async () => {
          const created = await service.createGiftCards({
            value: 75,
            currency_code: "usd",
            code: "GIFT-UPDATE-0001",
          })

          const updated = await service.updateGiftCards({
            id: created.id,
            status: GiftCardStatus.REDEEMED,
          })

          expect(updated).toEqual(
            expect.objectContaining({
              id: created.id,
              status: GiftCardStatus.REDEEMED,
            })
          )
        })

        it("should delete a gift card", async () => {
          const created = await service.createGiftCards({
            value: 25,
            currency_code: "usd",
            code: "GIFT-DELETE-0001",
          })

          await service.deleteGiftCards(created.id)

          await expect(service.retrieveGiftCard(created.id)).rejects.toThrow()
        })

        it("should not allow duplicate codes", async () => {
          await service.createGiftCards({
            value: 10,
            currency_code: "usd",
            code: "GIFT-DUPE-0001",
          })

          await expect(
            service.createGiftCards({
              value: 20,
              currency_code: "usd",
              code: "GIFT-DUPE-0001",
            })
          ).rejects.toThrow()
        })
      })
    })
  },
})

moduleIntegrationTestRunner<ILoyaltyModuleService>({
  moduleName: PluginModule.LOYALTY,
  resolve: __dirname + "/../../src/modules/loyalty",
  moduleOptions: { prefix: "XYZ", sections: 3 },
  dbName: "medusa-loyalty-options-integration",
  testSuite: ({ service, medusaApp }) => {
    describe("LoyaltyModuleService with custom options", () => {
      describe("Options", () => {
        it("should return the configured prefix and sections options", async () => {
          const options = service.getOptions()

          expect(options).toEqual(expect.objectContaining({ prefix: "XYZ", sections: 3 }))
        })

        it("should auto-generate a code using configured prefix and sections", async () => {
          const { result } = await createGiftCardsTestWorkflow(
            medusaApp.container
          ).run({
            input: [{ value: 50, currency_code: "usd" } as any],
          })

          const [giftCard] = result
          const parts = giftCard.code.split("-")

          expect(parts[0]).toBe("XYZ")
          expect(parts.length - 1).toBe(3)
          parts.slice(1).forEach((section) => expect(section).toHaveLength(4))
        })
      })
    })
  },
})
