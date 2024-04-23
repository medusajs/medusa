import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPromotionModuleService } from "@medusajs/types"
import { PromotionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /admin/promotions", () => {
      let appContainer
      let promotionModuleService: IPromotionModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        promotionModuleService = appContainer.resolve(
          ModuleRegistrationName.PROMOTION
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should throw an error if required params are not passed", async () => {
        const { response } = await api
          .post(
            `/admin/promotions`,
            {
              type: PromotionType.STANDARD,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(response.status).toEqual(400)
        // expect(response.data.message).toEqual(
        //   "code must be a string, code should not be empty, application_method should not be empty"
        // )
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
        // expect(response.data.message).toEqual(
        //   "Buy rules are required for buyget promotion type"
        // )
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
  },
})
