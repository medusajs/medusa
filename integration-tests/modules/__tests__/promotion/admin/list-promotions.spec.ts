import { IPromotionModuleService } from "@medusajs/types"
import { ModuleRegistrationName, PromotionType } from "@medusajs/utils"
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
    describe("GET /admin/promotions", () => {
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

      it("should get all promotions and its count", async () => {
        await promotionModuleService.createPromotions([
          {
            code: "TEST",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 100,
              currency_code: "USD",
            },
          },
        ])

        const response = await api.get(`/admin/promotions`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.promotions).toEqual([
          expect.objectContaining({
            id: expect.any(String),
            code: "TEST",
            is_automatic: false,
            type: "standard",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            rules: [],
            application_method: expect.objectContaining({
              id: expect.any(String),
              value: 100,
              type: "fixed",
              target_type: "order",
              allocation: null,
            }),
          }),
        ])
      })

      it("should support search of promotions", async () => {
        await promotionModuleService.createPromotions([
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
          {
            code: "second",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 100,
              currency_code: "USD",
            },
          },
        ])

        const response = await api.get(`/admin/promotions?q=fir`, adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.promotions).toEqual([
          expect.objectContaining({
            code: "first",
          }),
        ])
      })

      it("should get all promotions and its count filtered", async () => {
        await promotionModuleService.createPromotions([
          {
            code: "TEST",
            type: PromotionType.STANDARD,
            application_method: {
              type: "fixed",
              target_type: "order",
              value: 100,
              currency_code: "USD",
            },
          },
        ])

        const response = await api.get(
          `/admin/promotions?fields=code,created_at,application_method.id`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.promotions).toEqual([
          {
            id: expect.any(String),
            code: "TEST",
            created_at: expect.any(String),
            application_method: {
              id: expect.any(String),
            },
          },
        ])
      })
    })
  },
})
