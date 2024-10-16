import { PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Promotions API", () => {
      let appContainer
      let promotion
      let standardPromotion

      const promotionRule = {
        operator: "eq",
        attribute: "old_attr",
        values: ["old value"],
      }

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        promotion = standardPromotion = (
          await api.post(
            `/admin/promotions`,
            {
              code: "TEST_ACROSS",
              type: PromotionType.STANDARD,
              application_method: {
                type: "fixed",
                allocation: "across",
                target_type: "items",
                value: 100,
                target_rules: [promotionRule],
                currency_code: "USD",
              },
              rules: [promotionRule],
            },
            adminHeaders
          )
        ).data.promotion
      })

      describe("GET /admin/promotions/:id", () => {
        it("should throw an error if id does not exist", async () => {
          const { response } = await api
            .get(`/admin/promotions/does-not-exist`, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            "Promotion with id or code: does-not-exist was not found"
          )
        })

        it("should get the requested promotion by id or codde", async () => {
          let response = await api.get(
            `/admin/promotions/${promotion.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: promotion.id,
            })
          )

          response = await api.get(
            `/admin/promotions/${promotion.code}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: promotion.id,
            })
          )
        })

        it("should get the requested promotion with filtered fields and relations", async () => {
          const response = await api.get(
            `/admin/promotions/${promotion.id}?fields=id,code`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual({
            id: promotion.id,
            code: promotion.code,
          })
        })
      })

      describe("GET /admin/promotions", () => {
        it("should get all promotions and its count", async () => {
          const response = await api.get(`/admin/promotions`, adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.promotions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
            }),
          ])
        })

        it("should support search of promotions", async () => {
          await api.post(
            `/admin/promotions`,
            {
              code: "first",
              type: PromotionType.STANDARD,
              application_method: {
                type: "fixed",
                target_type: "order",
                value: 100,
                currency_code: "USD",
              },
            },
            adminHeaders
          )

          const response = await api.get(
            `/admin/promotions?q=fir`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotions).toEqual([
            expect.objectContaining({
              code: "first",
            }),
          ])
        })

        it("should get all promotions and its count filtered", async () => {
          const response = await api.get(
            `/admin/promotions?fields=code,created_at,application_method.id`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.promotions).toEqual([
            {
              id: expect.any(String),
              code: "TEST_ACROSS",
              created_at: expect.any(String),
              application_method: {
                id: expect.any(String),
              },
            },
          ])
        })
      })

      describe("POST /admin/promotions", () => {
        it("should throw an error if required params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              { type: PromotionType.STANDARD },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data.message).toEqual(
            "Invalid request: Field 'code' is required; Field 'application_method' is required"
          )
        })

        it("should create a standard promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions`,
            {
              code: "TEST",
              type: PromotionType.STANDARD,
              is_automatic: true,
              campaign: {
                name: "test",
                campaign_identifier: "test-1",
                budget: {
                  type: "usage",
                  limit: 100,
                },
              },
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "each",
                currency_code: "USD",
                value: 100,
                max_quantity: 100,
                target_rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              rules: [
                {
                  attribute: "test.test",
                  operator: "eq",
                  values: ["test1", "test2"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "TEST",
              type: "standard",
              is_automatic: true,
              campaign: expect.objectContaining({
                name: "test",
                campaign_identifier: "test-1",
                budget: expect.objectContaining({
                  currency_code: null,
                  type: "usage",
                  limit: 100,
                }),
              }),
              application_method: expect.objectContaining({
                value: 100,
                max_quantity: 100,
                type: "fixed",
                target_type: "items",
                allocation: "each",
                target_rules: [
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "test.test",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "test1" }),
                      expect.objectContaining({ value: "test2" }),
                    ]),
                  }),
                ],
              }),
              rules: [
                expect.objectContaining({
                  operator: "eq",
                  attribute: "test.test",
                  values: expect.arrayContaining([
                    expect.objectContaining({ value: "test1" }),
                    expect.objectContaining({ value: "test2" }),
                  ]),
                }),
              ],
            })
          )
        })

        it("should throw an error if buy_rules params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.BUYGET,
                is_automatic: true,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  value: 100,
                  max_quantity: 100,
                  currency_code: "USD",
                  target_rules: [
                    {
                      attribute: "test.test",
                      operator: "eq",
                      values: ["test1", "test2"],
                    },
                  ],
                },
                rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data.message).toEqual(
            "Invalid request: Buyget promotions require at least one buy rule and quantities to be defined"
          )
        })

        it("should throw an error if buy_rules params are not passed", async () => {
          const { response } = await api
            .post(
              `/admin/promotions`,
              {
                code: "TEST",
                type: PromotionType.BUYGET,
                is_automatic: true,
                application_method: {
                  target_type: "items",
                  type: "fixed",
                  allocation: "each",
                  value: 100,
                  max_quantity: 100,
                  currency_code: "USD",
                  buy_rules: [
                    {
                      attribute: "test.test",
                      operator: "eq",
                      values: ["test1", "test2"],
                    },
                  ],
                },
                rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          // expect(response.data.message).toEqual(
          //   "Target rules are required for buyget promotion type"
          // )
        })

        it("should create a buyget promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions`,
            {
              code: "TEST",
              type: PromotionType.BUYGET,
              is_automatic: true,
              campaign: {
                name: "test",
                campaign_identifier: "test-1",
                budget: {
                  type: "usage",
                  limit: 100,
                },
              },
              application_method: {
                target_type: "items",
                type: "fixed",
                allocation: "each",
                value: 100,
                max_quantity: 100,
                apply_to_quantity: 1,
                buy_rules_min_quantity: 1,
                currency_code: "USD",
                target_rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
                buy_rules: [
                  {
                    attribute: "test.test",
                    operator: "eq",
                    values: ["test1", "test2"],
                  },
                ],
              },
              rules: [
                {
                  attribute: "test.test",
                  operator: "eq",
                  values: ["test1", "test2"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "TEST",
              type: "buyget",
              is_automatic: true,
              campaign: expect.objectContaining({
                name: "test",
                campaign_identifier: "test-1",
                budget: expect.objectContaining({
                  type: "usage",
                  limit: 100,
                }),
              }),
              application_method: expect.objectContaining({
                value: 100,
                max_quantity: 100,
                type: "fixed",
                target_type: "items",
                allocation: "each",
                apply_to_quantity: 1,
                buy_rules_min_quantity: 1,
                target_rules: [
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "test.test",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "test1" }),
                      expect.objectContaining({ value: "test2" }),
                    ]),
                  }),
                ],
                buy_rules: [
                  expect.objectContaining({
                    operator: "eq",
                    attribute: "test.test",
                    values: expect.arrayContaining([
                      expect.objectContaining({ value: "test1" }),
                      expect.objectContaining({ value: "test2" }),
                    ]),
                  }),
                ],
              }),
              rules: [
                expect.objectContaining({
                  operator: "eq",
                  attribute: "test.test",
                  values: expect.arrayContaining([
                    expect.objectContaining({ value: "test1" }),
                    expect.objectContaining({ value: "test2" }),
                  ]),
                }),
              ],
            })
          )
        })
      })

      describe("DELETE /admin/promotions/:id", () => {
        it("should delete promotion successfully", async () => {
          const deleteRes = await api.delete(
            `/admin/promotions/${promotion.id}`,
            adminHeaders
          )

          expect(deleteRes.status).toEqual(200)

          const { response } = await api
            .get(`/admin/promotions/${promotion.id}`, adminHeaders)
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            `Promotion with id or code: ${promotion.id} was not found`
          )
        })
      })

      describe("POST /admin/promotions/:id", () => {
        it("should throw an error if id does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist`,
              { type: PromotionType.STANDARD },
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(404)
          expect(response.data.message).toEqual(
            `Promotion with id "does-not-exist" not found`
          )
        })

        it("should update a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${promotion.id}`,
            {
              code: "TEST_TWO",
              application_method: { value: 200 },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              code: "TEST_TWO",
              application_method: expect.objectContaining({
                value: 200,
              }),
            })
          )
        })

        it("should update a buyget promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${promotion.id}`,
            {
              code: "TEST_TWO",
              application_method: {
                value: 200,
                buy_rules_min_quantity: 6,
              },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              id: promotion.id,
              code: "TEST_TWO",
              application_method: expect.objectContaining({
                value: 200,
                buy_rules_min_quantity: 6,
              }),
            })
          )
        })
      })

      describe("POST /admin/promotions/:id/rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch`,
              {
                create: [
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
          // expect(response.data).toEqual({
          //   type: "invalid_data",
          //   message:
          //     "attribute must be a string, attribute should not be empty",
          // })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch`,
              {
                create: [
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
            `/admin/promotions/${standardPromotion.id}/rules/batch`,
            {
              create: [
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

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
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

      describe("POST /admin/promotions/:id/target-rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/target-rules/batch`,
              {
                create: [
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
          // expect(response.data).toEqual({
          //   type: "invalid_data",
          //   message:
          //     "attribute must be a string, attribute should not be empty",
          // })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch`,
              {
                create: [
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
            `/admin/promotions/${standardPromotion.id}/target-rules/batch`,
            {
              create: [
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

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
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

      describe("POST /admin/promotions/:id/buy-rules/batch", () => {
        it("should throw error when required params are missing", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch`,
              {
                create: [
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
          // expect(response.data).toEqual({
          //   type: "invalid_data",
          //   message:
          //     "attribute must be a string, attribute should not be empty",
          // })
        })

        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch`,
              {
                create: [
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
              `/admin/promotions/${standardPromotion.id}/buy-rules/batch`,
              {
                create: [
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
          const buyGetPromotion = (
            await api.post(
              `/admin/promotions`,
              {
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
                  currency_code: "USD",
                },
                rules: [promotionRule],
              },
              adminHeaders
            )
          ).data.promotion

          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch`,
            {
              create: [
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

          const promotion = (
            await api.get(
              `/admin/promotions/${buyGetPromotion.id}`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
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

      describe("POST /admin/promotions/:id/rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch`,
              { delete: ["test-rule-id"] },
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
            `/admin/promotions/${standardPromotion.id}/rules/batch`,
            { delete: [standardPromotion.rules[0].id] },
            adminHeaders
          )
          expect(response.status).toEqual(200)
          expect(response.data.deleted).toEqual({
            ids: [standardPromotion.rules[0].id],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion.rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/target-rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/target-rules/batch`,
              { delete: ["test-rule-id"] },
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
            `/admin/promotions/${standardPromotion.id}/target-rules/batch`,
            { delete: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.deleted).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*application_method.target_rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion.application_method!.target_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/buy-rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/buy-rules/batch`,
              { delete: ["test-rule-id"] },
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
          const buyGetPromotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "TEST_BUYGET",
                type: PromotionType.BUYGET,
                application_method: {
                  type: "fixed",
                  currency_code: "USD",
                  target_type: "items",
                  allocation: "across",
                  value: 100,
                  apply_to_quantity: 1,
                  buy_rules_min_quantity: 1,
                  buy_rules: [promotionRule],
                  target_rules: [promotionRule],
                },
                rules: [promotionRule],
              },
              adminHeaders
            )
          ).data.promotion

          const ruleId = buyGetPromotion!.application_method!.buy_rules![0].id
          const response = await api.post(
            `/admin/promotions/${buyGetPromotion.id}/buy-rules/batch`,
            { delete: [ruleId] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.deleted).toEqual({
            ids: [ruleId],
            object: "promotion-rule",
            deleted: true,
          })

          const promotion = (
            await api.get(
              `/admin/promotions/${buyGetPromotion.id}?fields=*application_method.buy_rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion.application_method!.buy_rules!.length).toEqual(0)
        })
      })

      describe("POST /admin/promotions/:id/rules/batch", () => {
        it("should throw error when promotion does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/does-not-exist/rules/batch`,
              {
                update: [
                  {
                    id: standardPromotion.rules[0].id,
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

        it("should throw error when promotion rule id does not exist", async () => {
          const { response } = await api
            .post(
              `/admin/promotions/${standardPromotion.id}/rules/batch`,
              {
                update: [
                  {
                    id: "does-not-exist",
                    attribute: "new_attr",
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
            message: "Promotion rules with id - does-not-exist not found",
          })
        })

        it("should add rules to a promotion successfully", async () => {
          const response = await api.post(
            `/admin/promotions/${standardPromotion.id}/rules/batch`,
            {
              update: [
                {
                  id: standardPromotion.rules[0].id,
                  operator: "eq",
                  attribute: "new_attr",
                  values: ["new value"],
                },
              ],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          const promotion = (
            await api.get(
              `/admin/promotions/${standardPromotion.id}?fields=*rules`,
              adminHeaders
            )
          ).data.promotion

          expect(promotion).toEqual(
            expect.objectContaining({
              id: standardPromotion.id,
              rules: expect.arrayContaining([
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

      describe("GET /admin/promotions/rule-attribute-options/:ruleType", () => {
        it("should throw error when ruleType is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-attribute-options/does-not-exist`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid param rule_type (does-not-exist)",
          })
        })

        it("return all rule attributes for a valid ruleType", async () => {
          const response = await api.get(
            `/admin/promotions/rule-attribute-options/rules`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.attributes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "currency_code",
                value: "currency_code",
                label: "Currency Code",
                field_type: "select",
                required: false,
                disguised: true,
                hydrate: true,
              }),
              expect.objectContaining({
                id: "customer_group",
                value: "customer.groups.id",
                label: "Customer Group",
                required: false,
                field_type: "multiselect",
              }),
              expect.objectContaining({
                id: "region",
                value: "region.id",
                label: "Region",
                required: false,
                field_type: "multiselect",
              }),
              expect.objectContaining({
                id: "country",
                value: "shipping_address.country_code",
                label: "Country",
                required: false,
                field_type: "multiselect",
              }),
              expect.objectContaining({
                id: "sales_channel",
                value: "sales_channel_id",
                label: "Sales Channel",
                required: false,
                field_type: "multiselect",
              }),
            ])
          )
        })
      })

      describe("GET /admin/promotions/rule-value-options/:ruleType/:ruleAttributeId", () => {
        it("should throw error when ruleType is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-value-options/does-not-exist/region`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid param rule_type (does-not-exist)",
          })
        })

        it("should throw error when ruleAttributeId is invalid", async () => {
          const { response } = await api
            .get(
              `/admin/promotions/rule-value-options/rules/does-not-exist`,
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid rule attribute - does-not-exist",
          })
        })

        it("should return all values based on rule types", async () => {
          const region1 = (
            await api.post(
              "/admin/regions",
              { name: "North America", currency_code: "usd" },
              adminHeaders
            )
          ).data.region

          const region2 = (
            await api.post(
              "/admin/regions",
              { name: "Europe", currency_code: "eur" },
              adminHeaders
            )
          ).data.region

          let response = await api.get(
            `/admin/promotions/rule-value-options/rules/region`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              {
                label: "North America",
                value: region1.id,
              },
              {
                label: "Europe",
                value: region2.id,
              },
            ])
          )

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/currency_code?limit=2&order=name`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Afghan Afghani", value: "afn" },
              { label: "Albanian Lek", value: "all" },
            ])
          )

          const group = (
            await api.post(
              "/admin/customer-groups",
              { name: "VIP" },
              adminHeaders
            )
          ).data.customer_group

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/customer_group`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            {
              label: "VIP",
              value: group.id,
            },
          ])

          const salesChannel = (
            await api.post(
              "/admin/sales-channels",
              { name: "Instagram" },
              adminHeaders
            )
          ).data.sales_channel

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/sales_channel`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          // TODO: This is returning a default sales channel, but very flakily
          // Figure out why this happens and fix
          // expect(response.data.values.length).toEqual(1)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Instagram", value: salesChannel.id },
            ])
          )

          response = await api.get(
            `/admin/promotions/rule-value-options/rules/country?limit=2`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              {
                label: "Andorra",
                value: "ad",
              },
              {
                label: "United Arab Emirates",
                value: "ae",
              },
            ])
          )

          const product1 = (
            await api.post(
              "/admin/products",
              {
                title: "Test product 1",
                options: [{ title: "size", values: ["large", "small"] }],
              },
              adminHeaders
            )
          ).data.product

          const product2 = (
            await api.post(
              "/admin/products",
              {
                title: "Test product 2",
                options: [{ title: "size", values: ["large", "small"] }],
              },
              adminHeaders
            )
          ).data.product

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "Test product 1", value: product1.id },
              { label: "Test product 2", value: product2.id },
            ])
          )

          const category = (
            await api.post(
              "/admin/product-categories",
              { name: "test category 1" },
              adminHeaders
            )
          ).data.product_category

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_category`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test category 1", value: category.id },
          ])

          const collection = (
            await api.post(
              "/admin/collections",
              { title: "test collection 1" },
              adminHeaders
            )
          ).data.collection

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_collection`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test collection 1", value: collection.id },
          ])

          const type = (
            await api.post(
              "/admin/product-types",
              { value: "test type" },
              adminHeaders
            )
          ).data.product_type

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_type`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values).toEqual([
            { label: "test type", value: type.id },
          ])

          const tag1 = (
            await api.post(
              "/admin/product-tags",
              { value: "test tag 1" },
              adminHeaders
            )
          ).data.product_tag

          const tag2 = (
            await api.post(
              "/admin/product-tags",
              { value: "test tag 2" },
              adminHeaders
            )
          ).data.product_tag

          response = await api.get(
            `/admin/promotions/rule-value-options/target-rules/product_tag`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.values.length).toEqual(2)
          expect(response.data.values).toEqual(
            expect.arrayContaining([
              { label: "test tag 1", value: tag1.id },
              { label: "test tag 2", value: tag2.id },
            ])
          )
        })
      })
    })
  },
})
