import { updateCartPromotionsWorkflow } from "@medusajs/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ICartModuleService, IPromotionModuleService } from "@medusajs/types"
import {
  Modules,
  PromotionActions,
  PromotionStatus,
  PromotionType,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("updateCartPromotionsWorkflow: setPromotionContext hook", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let promotionModuleService: IPromotionModuleService
      let storeHeaders

      // Toggled per test so we can register the hook once globally and
      // opt into different behaviour per case without re-registering.
      let setPromotionContextHook:
        | ((input: any) => StepResponse<Record<string, unknown> | undefined>)
        | undefined

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(Modules.CART)
        promotionModuleService = appContainer.resolve(Modules.PROMOTION)

        updateCartPromotionsWorkflow.hooks.setPromotionContext(
          (input) => {
            if (setPromotionContextHook) {
              return setPromotionContextHook(input)
            }
          },
          () => {}
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
      })

      afterEach(() => {
        setPromotionContextHook = undefined
      })

      it("should expose the cart, action and promo_codes to the hook", async () => {
        const promotion = await promotionModuleService.createPromotions({
          code: "HOOK_INPUT_SHAPE",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 100,
            apply_to_quantity: 1,
            currency_code: "usd",
          },
        })

        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        let receivedInput: any
        setPromotionContextHook = (input) => {
          receivedInput = input
          return new StepResponse(undefined)
        }

        const response = await api.post(
          `/store/carts/${cart.id}/promotions`,
          { promo_codes: [promotion.code] },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(receivedInput).toEqual(
          expect.objectContaining({
            cart: expect.objectContaining({ id: cart.id }),
            action: PromotionActions.ADD,
            promo_codes: [promotion.code],
          })
        )
      })

      it("should apply a promotion whose rule depends on a custom context attribute supplied by the hook", async () => {
        const companyId = "comp_acme"
        const promotion = await promotionModuleService.createPromotions({
          code: "B2B_DISCOUNT",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          rules: [
            {
              attribute: "company_id",
              operator: "eq",
              values: [companyId],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 500,
            apply_to_quantity: 1,
            currency_code: "usd",
          },
        })

        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        setPromotionContextHook = () =>
          new StepResponse({ company_id: companyId })

        const response = await api.post(
          `/store/carts/${cart.id}/promotions`,
          { promo_codes: [promotion.code] },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: promotion.code,
              amount: 500,
            }),
          ])
        )
      })

      it("should not apply the promotion when the hook does not supply the attribute its rule depends on", async () => {
        const promotion = await promotionModuleService.createPromotions({
          code: "B2B_DISCOUNT_UNMATCHED",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          rules: [
            {
              attribute: "company_id",
              operator: "eq",
              values: ["comp_acme"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 500,
            apply_to_quantity: 1,
            currency_code: "usd",
          },
        })

        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        // No hook is registered for this case — the cart context lacks
        // `company_id`, so the rule cannot be satisfied and the promotion
        // is not applied.
        const response = await api.post(
          `/store/carts/${cart.id}/promotions`,
          { promo_codes: [promotion.code] },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].adjustments).toEqual([])
      })

      it("should resolve nested attributes from the hook context (dot-path)", async () => {
        const promotion = await promotionModuleService.createPromotions({
          code: "B2B_TIER_DISCOUNT",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          rules: [
            {
              attribute: "company.tier",
              operator: "eq",
              values: ["gold"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 700,
            apply_to_quantity: 1,
            currency_code: "usd",
          },
        })

        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        setPromotionContextHook = () =>
          new StepResponse({
            company: { id: "comp_acme", tier: "gold" },
          })

        const response = await api.post(
          `/store/carts/${cart.id}/promotions`,
          { promo_codes: [promotion.code] },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: promotion.code,
              amount: 700,
            }),
          ])
        )
      })

      it("should not apply the promotion when the hook supplies the attribute but with a non-matching value", async () => {
        const promotion = await promotionModuleService.createPromotions({
          code: "B2B_DISCOUNT_WRONG_VALUE",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          rules: [
            {
              attribute: "company_id",
              operator: "eq",
              values: ["comp_acme"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 500,
            apply_to_quantity: 1,
            currency_code: "usd",
          },
        })

        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        // Hook supplies company_id but with a value that does not satisfy the rule.
        setPromotionContextHook = () =>
          new StepResponse({ company_id: "comp_other" })

        const response = await api.post(
          `/store/carts/${cart.id}/promotions`,
          { promo_codes: [promotion.code] },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].adjustments).toEqual([])
      })

      it("should use the hook context value over the existing cart attribute when keys conflict", async () => {
        const promotion = await promotionModuleService.createPromotions({
          code: "EMAIL_DISCOUNT_OVERRIDE",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          rules: [
            {
              attribute: "email",
              operator: "eq",
              values: ["cart@example.com"],
            },
          ],
          application_method: {
            type: "fixed",
            target_type: "items",
            allocation: "across",
            value: 300,
            apply_to_quantity: 1,
            currency_code: "usd",
          },
        })

        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          email: "cart@example.com",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        setPromotionContextHook = () =>
          new StepResponse({ email: "hook@example.com" })

        const response = await api.post(
          `/store/carts/${cart.id}/promotions`,
          { promo_codes: [promotion.code] },
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.cart.items[0].adjustments).toEqual([])
      })

      it("should reject a non-object response from the hook", async () => {
        const cart = await cartModuleService.createCarts({
          currency_code: "usd",
          items: [
            {
              unit_price: 2000,
              quantity: 1,
              title: "Test item",
            } as any,
          ],
        })

        setPromotionContextHook = () =>
          new StepResponse([1] as unknown as Record<string, unknown>)

        const { errors } = await updateCartPromotionsWorkflow(appContainer).run(
          {
            throwOnError: false,
            input: {
              cart_id: cart.id,
              promo_codes: [],
              action: PromotionActions.ADD,
            },
          }
        )

        expect(errors).toHaveLength(1)
        expect(errors[0]).toEqual(
          expect.objectContaining({
            action: "get-setPromotionContext-result",
            handlerType: "invoke",
            error: expect.objectContaining({
              issues: [
                {
                  code: "invalid_type",
                  expected: "record",
                  message: "Invalid input: expected record, received array",
                  path: [],
                },
              ],
            }),
          })
        )
      })
    })
  },
})
