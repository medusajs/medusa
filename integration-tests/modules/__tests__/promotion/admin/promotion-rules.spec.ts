import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin: Promotion Rules API", () => {
      let appContainer
      let standardPromotion
      let promotionModule: IPromotionModuleService
      const promotionRule = {
        operator: "eq",
        attribute: "old_attr",
        values: ["old value"],
      }

      beforeAll(async () => {
        appContainer = getContainer()
        promotionModule = appContainer.resolve(ModuleRegistrationName.PROMOTION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        standardPromotion = await promotionModule.create({
          code: "TEST_ACROSS",
          type: PromotionType.STANDARD,
          application_method: {
            type: "fixed",
            allocation: "across",
            target_type: "items",
            value: 100,
            target_rules: [promotionRule],
          },
          rules: [promotionRule],
        })
      })

      describe("POST /admin/promotions/:id/rules/batch/add", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch/add`,
              {
                rules: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should add rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch/add`,
            {
              rules: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              rules: expect.arrayContaining([
                expect.objectContaining({
                  operator: "eq",
                  attribute: "old_attr",
                  values: [expect.objectContaining({ value: "old value" })],
                }),
                expect.objectContaining({
                  operator: "eq",
                  attribute: "new_attr",
                  values: [expect.objectContaining({ value: "new value" })],
                }),
              ]),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch/add", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/target-rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch/add`,
              {
                rules: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should add target rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/target-rules/batch/add`,
            {
              rules: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              application_method: expect.objectContaining({
                target_rules: expect.arrayContaining([
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "old_attr",
                    values: [expect.objectContaining({ value: "old value" })],
                  }),
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "new_attr",
                    values: [expect.objectContaining({ value: "new value" })],
                  }),
                ]),
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch/add", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "attribute must be a string, attribute should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch/add`,
              {
                rules: [
                  {
                    attribute: "new_attr",
                    operator: "eq",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should throw an error when trying to add buy rules to a standard promotion", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch/add`,
              {
                rules: [
                  {
                    operator: "eq",
                    attribute: "new_attr",
                    values: ["new value"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Can't add buy rules to a standard promotion",
          })
        })

        it("should add buy rules to a buyget promotion successfully", async () => {
          const buyGetPromotion = await promotionModule.create({
            code: "TEST_BUYGET",
            type: PromotionType.BUYGET,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 100,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              buy_rules: [promotionRule],
              target_rules: [promotionRule],
            },
            rules: [promotionRule],
          })

          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch/add`,
            {
              rules: [
                {
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: buyGetPromotion.id,
              application_method: expect.objectContaining({
                buy_rules: expect.arrayContaining([
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "old_attr",
                    values: [expect.objectContaining({ value: "old value" })],
                  }),
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "new_attr",
                    values: [expect.objectContaining({ value: "new value" })],
                  }),
                ]),
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/rules/batch/remove", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch/remove`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch/remove`,
              { rule_ids: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove rules from a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch/remove`,
            { rule_ids: [standardPromotion.rules[0].id] },
            adminHeaders
          )
          console.log("response.data ---- ", response.data)
          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            ids: [standardPromotion.rules[0].id],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = await promotionModule.retrieve(
            standardPromotion.id,
            { relations: ["rules"] }
          )

          expect(promotion.rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch/remove", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/target-rules/batch/remove`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch/remove`,
              { rule_ids: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove target rules from a promotion successfully", async () => {
          const ruleId = standardPromotion.application_method.target_rules[0].id
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/target-rules/batch/remove`,
            { rule_ids: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = await promotionModule.retrieve(
            standardPromotion.id,
            { relations: ["application_method.target_rules"] }
          )

          expect(promotion.application_method!.target_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch/remove", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch/remove`,
              {},
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "each value in rule_ids must be a string, rule_ids should not be empty",
          })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch/remove`,
              { rule_ids: ["test-rule-id"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data).toEqual({
            type: "not_found",
            message: "Promotion with id: does-not-exist was not found",
          })
        })

        it("should remove buy rules from a promotion successfully", async () => {
          const buyGetPromotion = await promotionModule.create({
            code: "TEST_BUYGET",
            type: PromotionType.BUYGET,
            application_method: {
              type: "fixed",
              target_type: "items",
              allocation: "across",
              value: 100,
              apply_to_quantity: 1,
              buy_rules_min_quantity: 1,
              buy_rules: [promotionRule],
              target_rules: [promotionRule],
            },
            rules: [promotionRule],
          })

          const ruleId = buyGetPromotion!.application_method!.buy_rules![0].id
          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch/remove`,
            { rule_ids: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = await promotionModule.retrieve(buyGetPromotion.id, {
            relations: ["application_method.buy_rules"],
          })

          expect(promotion.application_method!.buy_rules!.length).toEqual(0)
        })
      })
    })
  },
})
