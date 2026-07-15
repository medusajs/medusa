import {
  updateOrderTaxLinesWorkflow,
  updateTaxLinesWorkflow,
  upsertTaxLinesWorkflow,
} from "@medusajs/core-flows"
import { StepResponse } from "@medusajs/framework/workflows-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ICartModuleService,
  IOrderModuleService,
  ITaxModuleService,
} from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(100000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("setTaxLineContext hook - additional tax context passthrough", () => {
      let appContainer
      let cartModuleService: ICartModuleService
      let orderModuleService: IOrderModuleService
      let taxModuleService: ITaxModuleService

      // Toggled per test so the hook can be registered once globally and
      // opt into different behaviour per case without re-registering.
      let setTaxLineContextHook:
        | ((input: any) => StepResponse<Record<string, unknown> | undefined>)
        | undefined

      beforeAll(async () => {
        appContainer = getContainer()
        cartModuleService = appContainer.resolve(Modules.CART)
        orderModuleService = appContainer.resolve(Modules.ORDER)
        taxModuleService = appContainer.resolve(Modules.TAX)

        const hook = (input: any) => {
          if (setTaxLineContextHook) {
            return setTaxLineContextHook(input)
          }
        }

        updateTaxLinesWorkflow.hooks.setTaxLineContext(hook, () => {})
        upsertTaxLinesWorkflow.hooks.setTaxLineContext(hook, () => {})
        updateOrderTaxLinesWorkflow.hooks.setTaxLineContext(hook, () => {})
      })

      afterEach(() => {
        setTaxLineContextHook = undefined
        jest.restoreAllMocks()
      })

      /**
       * Spies on the tax module service's `getTaxLines` (the same singleton the
       * workflow step resolves) so we can inspect the `TaxCalculationContext`
       * that ultimately reaches the tax provider. The implementation is mocked
       * to return no tax lines so the test does not depend on a configured tax
       * region.
       */
      const spyOnGetTaxLines = () => {
        return jest.spyOn(taxModuleService, "getTaxLines").mockResolvedValue([])
      }

      describe("updateTaxLinesWorkflow (cart)", () => {
        it("forwards the hook result as additional_context to the tax provider", async () => {
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            shipping_address: { country_code: "us" },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
          })

          const additionalContext = {
            tax_exempt: true,
            certificate_id: "cert_123",
          }

          setTaxLineContextHook = () => new StepResponse(additionalContext)

          const getTaxLinesSpy = spyOnGetTaxLines()

          await updateTaxLinesWorkflow(appContainer).run({
            input: { cart_id: cart.id, force_tax_calculation: true },
            throwOnError: true,
          })

          expect(getTaxLinesSpy).toHaveBeenCalled()
          const [, calculationContext] = getTaxLinesSpy.mock.calls[0]
          expect(calculationContext.additional_context).toEqual(
            additionalContext
          )
        })

        it("exposes the cart, items and shipping_methods to the hook", async () => {
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            shipping_address: { country_code: "us" },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
          })

          let receivedInput: any
          setTaxLineContextHook = (input) => {
            receivedInput = input
            return new StepResponse(undefined)
          }

          spyOnGetTaxLines()

          await updateTaxLinesWorkflow(appContainer).run({
            input: { cart_id: cart.id, force_tax_calculation: true },
            throwOnError: true,
          })

          expect(receivedInput).toEqual(
            expect.objectContaining({
              cart: expect.objectContaining({ id: cart.id }),
              items: expect.any(Array),
            })
          )
          expect(receivedInput).toHaveProperty("shipping_methods")
        })
      })

      describe("upsertTaxLinesWorkflow (cart)", () => {
        it("forwards the hook result as additional_context to the tax provider", async () => {
          const cart = await cartModuleService.createCarts({
            currency_code: "usd",
            shipping_address: { country_code: "us" },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
          })

          const cartWithItems = await cartModuleService.retrieveCart(cart.id, {
            relations: ["items"],
          })

          const additionalContext = { vat_validated: true }

          setTaxLineContextHook = () => new StepResponse(additionalContext)

          const getTaxLinesSpy = spyOnGetTaxLines()

          await upsertTaxLinesWorkflow(appContainer).run({
            input: {
              cart_id: cart.id,
              items: cartWithItems.items as any,
              shipping_methods: [],
              force_tax_calculation: true,
            },
            throwOnError: true,
          })

          expect(getTaxLinesSpy).toHaveBeenCalled()
          const [, calculationContext] = getTaxLinesSpy.mock.calls[0]
          expect(calculationContext.additional_context).toEqual(
            additionalContext
          )
        })
      })

      describe("updateOrderTaxLinesWorkflow (order)", () => {
        it("forwards the hook result as additional_context to the tax provider", async () => {
          const order = await orderModuleService.createOrders({
            currency_code: "usd",
            email: "test@medusajs.com",
            shipping_address: {
              first_name: "Test",
              last_name: "Test",
              address_1: "Test",
              city: "Test",
              country_code: "us",
              postal_code: "12345",
            },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
          })

          const additionalContext = { nexus_state: "ca" }

          setTaxLineContextHook = () => new StepResponse(additionalContext)

          const getTaxLinesSpy = spyOnGetTaxLines()

          await updateOrderTaxLinesWorkflow(appContainer).run({
            input: { order_id: order.id, force_tax_calculation: true },
            throwOnError: true,
          })

          expect(getTaxLinesSpy).toHaveBeenCalled()
          const [, calculationContext] = getTaxLinesSpy.mock.calls[0]
          expect(calculationContext.additional_context).toEqual(
            additionalContext
          )
        })

        it("forwards shipping method names to the tax provider for full-order calculations", async () => {
          const order = await orderModuleService.createOrders({
            currency_code: "usd",
            email: "test@medusajs.com",
            shipping_address: {
              first_name: "Test",
              last_name: "Test",
              address_1: "Test",
              city: "Test",
              country_code: "us",
              postal_code: "12345",
            },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
            shipping_methods: [
              {
                name: "Standard Shipping",
                amount: 1000,
                data: {},
              },
            ],
          })

          const getTaxLinesSpy = spyOnGetTaxLines()

          await updateOrderTaxLinesWorkflow(appContainer).run({
            input: { order_id: order.id, force_tax_calculation: true },
            throwOnError: true,
          })

          expect(getTaxLinesSpy).toHaveBeenCalled()
          const [, calculationContext] = getTaxLinesSpy.mock.calls[0]
          expect(calculationContext.shipping_methods).toEqual([
            expect.objectContaining({
              name: "Standard Shipping",
            }),
          ])
        })

        it("forwards shipping method names to the tax provider for partial shipping calculations", async () => {
          const order = await orderModuleService.createOrders({
            currency_code: "usd",
            email: "test@medusajs.com",
            shipping_address: {
              first_name: "Test",
              last_name: "Test",
              address_1: "Test",
              city: "Test",
              country_code: "us",
              postal_code: "12345",
            },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
            shipping_methods: [
              {
                name: "Express Shipping",
                amount: 1500,
                data: {},
              },
            ],
          })

          const shippingMethod = order.shipping_methods![0]
          const getTaxLinesSpy = spyOnGetTaxLines()

          await updateOrderTaxLinesWorkflow(appContainer).run({
            input: {
              order_id: order.id,
              shipping_method_ids: [shippingMethod.id],
              force_tax_calculation: true,
            },
            throwOnError: true,
          })

          expect(getTaxLinesSpy).toHaveBeenCalled()
          const [, calculationContext] = getTaxLinesSpy.mock.calls[0]
          expect(calculationContext.shipping_methods).toEqual([
            expect.objectContaining({
              name: "Express Shipping",
            }),
          ])
        })

        it("exposes the order, items and shipping_methods to the hook", async () => {
          const order = await orderModuleService.createOrders({
            currency_code: "usd",
            email: "test@medusajs.com",
            shipping_address: {
              first_name: "Test",
              last_name: "Test",
              address_1: "Test",
              city: "Test",
              country_code: "us",
              postal_code: "12345",
            },
            items: [{ quantity: 1, unit_price: 5000, title: "Test item" }],
          })

          let receivedInput: any
          setTaxLineContextHook = (input) => {
            receivedInput = input
            return new StepResponse(undefined)
          }

          spyOnGetTaxLines()

          await updateOrderTaxLinesWorkflow(appContainer).run({
            input: { order_id: order.id, force_tax_calculation: true },
            throwOnError: true,
          })

          // For a full-order calculation the hook receives the `order`
          // (with its nested items and shipping methods). The separate
          // `items`/`shipping_methods` inputs are only populated for partial
          // calculations driven by `item_ids`/`shipping_method_ids`.
          expect(receivedInput).toEqual(
            expect.objectContaining({
              order: expect.objectContaining({
                id: order.id,
                items: expect.any(Array),
              }),
            })
          )
        })
      })
    })
  },
})
