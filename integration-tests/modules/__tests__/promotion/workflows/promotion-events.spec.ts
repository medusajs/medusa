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
import { IEventBusModuleService, PromotionDTO } from "@medusajs/types"
import {
  CampaignWorkflowEvents,
  Modules,
  PromotionWorkflowEvents,
  RuleType,
} from "@medusajs/utils"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: Promotion and campaign events", () => {
      let appContainer
      let eventBusService: IEventBusModuleService
      let emitSpy: jest.SpyInstance
      let promotion: PromotionDTO

      beforeAll(async () => {
        appContainer = getContainer()
        eventBusService = appContainer.resolve(Modules.EVENT_BUS)
      })

      beforeEach(async () => {
        const { result } = await createPromotionsWorkflow(appContainer).run({
          input: {
            promotionsData: [
              {
                code: "10OFF",
                type: "standard",
                status: "draft",
                application_method: {
                  type: "percentage",
                  target_type: "items",
                  allocation: "across",
                  value: 10,
                },
              },
            ],
          },
        })

        promotion = result[0]
        emitSpy = jest.spyOn(eventBusService, "emit")
      })

      afterEach(() => {
        emitSpy.mockRestore()
      })

      const getEmittedEvents = (name: string) =>
        emitSpy.mock.calls
          .flatMap(([events]) => (Array.isArray(events) ? events : [events]))
          .filter((event) => event.name === name)
          .map((event) => event.data)

      const createCampaign = async () => {
        const { result } = await createCampaignsWorkflow(appContainer).run({
          input: {
            campaignsData: [{ name: "Summer", campaign_identifier: "summer" }],
          },
        })

        return result[0]
      }

      describe("promotions", () => {
        it("should emit promotion.created, updated and deleted", async () => {
          const { result } = await createPromotionsWorkflow(appContainer).run({
            input: {
              promotionsData: [
                {
                  code: "20OFF",
                  type: "standard",
                  status: "draft",
                  application_method: {
                    type: "percentage",
                    target_type: "items",
                    allocation: "across",
                    value: 20,
                  },
                },
              ],
            },
          })
          const created = result[0]

          await updatePromotionsWorkflow(appContainer).run({
            input: {
              promotionsData: [{ id: created.id, status: "active" }],
            },
          })

          await deletePromotionsWorkflow(appContainer).run({
            input: { ids: [created.id] },
          })

          expect(getEmittedEvents(PromotionWorkflowEvents.CREATED)).toEqual([
            { id: created.id },
          ])
          expect(getEmittedEvents(PromotionWorkflowEvents.UPDATED)).toEqual([
            { id: created.id },
          ])
          expect(getEmittedEvents(PromotionWorkflowEvents.DELETED)).toEqual([
            { id: created.id },
          ])
        })

        it("should emit promotion.rules_updated with the changed rule IDs", async () => {
          const { result: first } = await batchPromotionRulesWorkflow(
            appContainer
          ).run({
            input: {
              id: promotion.id,
              rule_type: RuleType.RULES,
              create: [
                {
                  attribute: "customer.groups.id",
                  operator: "in",
                  values: ["cusgrp_1"],
                },
              ],
            },
          })
          const ruleId = first.created[0].id

          await batchPromotionRulesWorkflow(appContainer).run({
            input: {
              id: promotion.id,
              rule_type: RuleType.RULES,
              update: [{ id: ruleId, values: ["cusgrp_2"] }],
            },
          })

          await batchPromotionRulesWorkflow(appContainer).run({
            input: {
              id: promotion.id,
              rule_type: RuleType.RULES,
              delete: [ruleId],
            },
          })

          expect(
            getEmittedEvents(PromotionWorkflowEvents.RULES_UPDATED)
          ).toEqual([
            {
              id: promotion.id,
              rule_type: RuleType.RULES,
              created: [ruleId],
              updated: [],
              deleted: [],
            },
            {
              id: promotion.id,
              rule_type: RuleType.RULES,
              created: [],
              updated: [ruleId],
              deleted: [],
            },
            {
              id: promotion.id,
              rule_type: RuleType.RULES,
              created: [],
              updated: [],
              deleted: [ruleId],
            },
          ])
        })
      })

      describe("campaigns", () => {
        it("should emit campaign.created, updated and deleted", async () => {
          const campaign = await createCampaign()

          await updateCampaignsWorkflow(appContainer).run({
            input: {
              campaignsData: [{ id: campaign.id, name: "Winter" }],
            },
          })

          await deleteCampaignsWorkflow(appContainer).run({
            input: { ids: [campaign.id] },
          })

          expect(getEmittedEvents(CampaignWorkflowEvents.CREATED)).toEqual([
            { id: campaign.id },
          ])
          expect(getEmittedEvents(CampaignWorkflowEvents.UPDATED)).toEqual([
            { id: campaign.id },
          ])
          expect(getEmittedEvents(CampaignWorkflowEvents.DELETED)).toEqual([
            { id: campaign.id },
          ])
        })

        it("should emit campaign.promotions_updated with the added and removed promotions", async () => {
          const campaign = await createCampaign()

          await addOrRemoveCampaignPromotionsWorkflow(appContainer).run({
            input: { id: campaign.id, add: [promotion.id] },
          })

          await addOrRemoveCampaignPromotionsWorkflow(appContainer).run({
            input: { id: campaign.id, remove: [promotion.id] },
          })

          expect(
            getEmittedEvents(CampaignWorkflowEvents.PROMOTIONS_UPDATED)
          ).toEqual([
            {
              id: campaign.id,
              added_promotion_ids: [promotion.id],
              removed_promotion_ids: [],
            },
            {
              id: campaign.id,
              added_promotion_ids: [],
              removed_promotion_ids: [promotion.id],
            },
          ])
        })
      })
    })
  },
})
