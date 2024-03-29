import { PromotionType } from "@medusajs/utils"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { createPromotions } from "../../../__fixtures__/promotion"
import { IPromotionModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PROMOTION,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IPromotionModuleService>) => {
    describe("Promotion Service", () => {
      beforeEach(async () => {
        await createPromotions(MikroOrmWrapper.forkManager())
      })

      describe("create", () => {
        it("should throw an error when required params are not passed", async () => {
          const error = await service
            .create([
              {
                type: PromotionType.STANDARD,
              } as any,
            ])
            .catch((e) => e)

          expect(error.message).toContain(
            "Value for Promotion.code is required, 'undefined' found"
          )
        })

        it("should create a promotion successfully", async () => {
          await service.create([
            {
              code: "PROMOTION_TEST",
              type: PromotionType.STANDARD,
            },
          ])

          const [promotion] = await service.list({
            code: ["PROMOTION_TEST"],
          })

          expect(promotion).toEqual(
            expect.objectContaining({
              code: "PROMOTION_TEST",
              is_automatic: false,
              type: "standard",
            })
          )
        })
      })
    })
  },
})
