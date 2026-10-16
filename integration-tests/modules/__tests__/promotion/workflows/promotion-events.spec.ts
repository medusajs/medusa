import {
  addOrRemoveCampaignPromotionsWorkflow,
  batchPromotionRulesWorkflow,
  createCampaignsWorkflow,
  createPromotionsWorkflow,
  deleteCampaignsWorkflow,
  deletePromotionsWorkflow,
  updateCampaignsWorkflow,
  updatePromotionsWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IEventBusModuleService } from "@medusajs/types"
import {
  CampaignWorkflowEvents,
  Modules,
  PromotionRuleWorkflowEvents,
  PromotionWorkflowEvents,
  RuleType,
} from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: Promotion and campaign events", () => {
      let appContainer
      let emitSpy: jest.SpyInstance

      beforeEach(() => {
        appContainer = getContainer()
        emitSpy = jest.spyOn(
          appContainer.resolve(Modules.EVENT_BUS) as IEventBusModuleService,
          "emit"
        )
      })

      afterEach(() => {
        emitSpy.mockRestore()
      })

      const getEmittedEvents = (name: string) =>
        emitSpy.mock.calls
          .flatMap(([events]) => [events].flat())
          .filter((event) => event.name === name)
          .map((event) => event.data)

      const createPromotions = async (codes: string[]) => {
        const { result } = await createPromotionsWorkflow(appContainer).run({
          input: {
            promotionsData: codes.map((code) => ({
              code,
              type: "standard",
              status: "draft",
              application_method: {
                type: "percentage",
                target_type: "items",
                allocation: "across",
                value: 10,
              },
            })),
          },
        })

        return result
      }

      it("should emit promotion.created, updated and deleted", async () => {
        const [promo, otherPromo] = await createPromotions(["P1", "P2"])

        // A status change runs a nested workflow, which mustn't lead to a
        // second promotion.updated event for the same promotion
        await updatePromotionsWorkflow(appContainer).run({
          input: {
            promotionsData: [
              { id: promo.id, code: "P1_UPDATED" },
              { id: otherPromo.id, status: "active" },
            ],
          },
        })

        await deletePromotionsWorkflow(appContainer).run({
          input: { ids: [promo.id] },
        })

        expect(getEmittedEvents(PromotionWorkflowEvents.CREATED)).toEqual([
          { id: promo.id },
          { id: otherPromo.id },
        ])
        expect(
          getEmittedEvents(PromotionWorkflowEvents.UPDATED)
            .map(({ id }) => id)
            .sort()
        ).toEqual([promo.id, otherPromo.id].sort())
        expect(getEmittedEvents(PromotionWorkflowEvents.DELETED)).toEqual([
          { id: promo.id },
        ])
      })

      it.each([
        [RuleType.RULES, "currency_code"],
        [RuleType.TARGET_RULES, "items.product.id"],
      ])(
        "should emit promotion-rule events for %s",
        async (ruleType, attribute) => {
          const [promo] = await createPromotions(["P3"])

          const batchRules = (input: Record<string, unknown>) =>
            batchPromotionRulesWorkflow(appContainer).run({
              input: { id: promo.id, rule_type: ruleType, ...input },
            })

          const { result } = await batchRules({
            create: [{ attribute, operator: "eq", values: ["a"] }],
          })
          const ruleId = result.created[0].id

          await batchRules({ update: [{ id: ruleId, values: ["b"] }] })
          await batchRules({ delete: [ruleId] })

          const expected = [
            { id: ruleId, promotion_id: promo.id, rule_type: ruleType },
          ]

          for (const eventName of Object.values(PromotionRuleWorkflowEvents)) {
            expect(getEmittedEvents(eventName)).toEqual(expected)
          }
        }
      )

      it("should emit campaign.created, updated and deleted", async () => {
        const [promo] = await createPromotions(["P4"])

        const {
          result: [campaign],
        } = await createCampaignsWorkflow(appContainer).run({
          input: {
            campaignsData: [{ name: "Sale", campaign_identifier: "SALE" }],
          },
        })

        await updateCampaignsWorkflow(appContainer).run({
          input: { campaignsData: [{ id: campaign.id, name: "Big sale" }] },
        })

        await addOrRemoveCampaignPromotionsWorkflow(appContainer).run({
          input: { id: campaign.id, add: [promo.id] },
        })

        await deleteCampaignsWorkflow(appContainer).run({
          input: { ids: [campaign.id] },
        })

        expect(getEmittedEvents(CampaignWorkflowEvents.CREATED)).toEqual([
          { id: campaign.id },
        ])
        expect(getEmittedEvents(CampaignWorkflowEvents.UPDATED)).toEqual([
          { id: campaign.id },
          { id: campaign.id },
        ])
        expect(getEmittedEvents(CampaignWorkflowEvents.DELETED)).toEqual([
          { id: campaign.id },
        ])
        expect(getEmittedEvents(PromotionWorkflowEvents.UPDATED)).toEqual([
          { id: promo.id },
        ])
      })
    })
  },
})
