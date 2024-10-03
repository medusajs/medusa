import {
  CartWorkflowDTO,
  CreateLineItemTaxLineDTO,
  CreateShippingMethodTaxLineDTO,
  ICartModuleService,
  ItemTaxLineDTO,
  LineItemTaxLineDTO,
  ShippingMethodTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export interface SetTaxLinesForItemsStepInput {
  cart: CartWorkflowDTO
  item_tax_lines: ItemTaxLineDTO[]
  shipping_tax_lines: ShippingTaxLineDTO[]
}

export const setTaxLinesForItemsStepId = "set-tax-lines-for-items"
/**
 * This step sets the tax lines of shipping methods and line items in a cart.
 */
export const setTaxLinesForItemsStep = createStep(
  setTaxLinesForItemsStepId,
  async (data: SetTaxLinesForItemsStepInput, { container }) => {
    const { cart, item_tax_lines, shipping_tax_lines } = data
    const cartService = container.resolve<ICartModuleService>(Modules.CART)

    const existingShippingMethodTaxLines =
      await cartService.listShippingMethodTaxLines({
        shipping_method_id: shipping_tax_lines.map((t) => t.shipping_line_id),
      })

    const existingLineItemTaxLines = await cartService.listLineItemTaxLines({
      item_id: item_tax_lines.map((t) => t.line_item_id),
    })

    const itemsTaxLinesData = normalizeItemTaxLinesForCart(item_tax_lines)
    const setItemTaxLinesPromise = itemsTaxLinesData.length
      ? cartService.setLineItemTaxLines(cart.id, itemsTaxLinesData)
      : ([] as LineItemTaxLineDTO[])

    const shippingTaxLinesData =
      normalizeShippingTaxLinesForCart(shipping_tax_lines)
    const setShippingTaxLinesPromise = shippingTaxLinesData.length
      ? cartService.setShippingMethodTaxLines(cart.id, shippingTaxLinesData)
      : ([] as ShippingMethodTaxLineDTO[])

    const [lineItemTaxLines, shippingMethodsTaxLines] = (await promiseAll([
      setItemTaxLinesPromise,
      setShippingTaxLinesPromise,
    ])) as [LineItemTaxLineDTO[], ShippingMethodTaxLineDTO[]]

    return new StepResponse(
      { lineItemTaxLines, shippingMethodsTaxLines },
      {
        cart,
        existingLineItemTaxLines,
        existingShippingMethodTaxLines,
      }
    )
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const { cart, existingLineItemTaxLines, existingShippingMethodTaxLines } =
      revertData

    const cartService = container.resolve<ICartModuleService>(Modules.CART)

    if (existingLineItemTaxLines?.length) {
      await cartService.setLineItemTaxLines(
        cart.id,
        existingLineItemTaxLines.map((taxLine) => ({
          description: taxLine.description,
          tax_rate_id: taxLine.tax_rate_id,
          code: taxLine.code,
          rate: taxLine.rate,
          provider_id: taxLine.provider_id,
          item_id: taxLine.item_id,
        }))
      )
    }

    await cartService.setShippingMethodTaxLines(
      cart.id,
      existingShippingMethodTaxLines.map((taxLine) => ({
        description: taxLine.description,
        tax_rate_id: taxLine.tax_rate_id,
        code: taxLine.code,
        rate: taxLine.rate,
        provider_id: taxLine.provider_id,
        shipping_method_id: taxLine.shipping_method_id,
      }))
    )
  }
)

function normalizeItemTaxLinesForCart(
  taxLines: ItemTaxLineDTO[]
): CreateLineItemTaxLineDTO[] {
  return taxLines.map((taxLine) => ({
    description: taxLine.name,
    tax_rate_id: taxLine.rate_id,
    code: taxLine.code!,
    rate: taxLine.rate!,
    provider_id: taxLine.provider_id,
    item_id: taxLine.line_item_id,
  }))
}

function normalizeShippingTaxLinesForCart(
  taxLines: ShippingTaxLineDTO[]
): CreateShippingMethodTaxLineDTO[] {
  return taxLines.map((taxLine) => ({
    description: taxLine.name,
    tax_rate_id: taxLine.rate_id,
    code: taxLine.code!,
    rate: taxLine.rate!,
    provider_id: taxLine.provider_id,
    shipping_method_id: taxLine.shipping_line_id,
  }))
}
