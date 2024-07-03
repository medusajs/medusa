import {
  CartWorkflowDTO,
  CreateLineItemTaxLineDTO,
  CreateShippingMethodTaxLineDTO,
  ICartModuleService,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartWorkflowDTO
  item_tax_lines: ItemTaxLineDTO[]
  shipping_tax_lines: ShippingTaxLineDTO[]
}

export const setTaxLinesForItemsStepId = "set-tax-lines-for-items"
export const setTaxLinesForItemsStep = createStep(
  setTaxLinesForItemsStepId,
  async (data: StepInput, { container }) => {
    const { cart, item_tax_lines, shipping_tax_lines } = data
    const cartService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const getShippingTaxLinesPromise =
      await cartService.listShippingMethodTaxLines({
        shipping_method_id: shipping_tax_lines.map((t) => t.shipping_line_id),
      })

    const getItemTaxLinesPromise = await cartService.listLineItemTaxLines({
      item_id: item_tax_lines.map((t) => t.line_item_id),
    })

    const itemsTaxLinesData = normalizeItemTaxLinesForCart(item_tax_lines)
    const setItemTaxLinesPromise = itemsTaxLinesData.length
      ? cartService.setLineItemTaxLines(cart.id, itemsTaxLinesData)
      : 0

    const shippingTaxLinesData =
      normalizeShippingTaxLinesForCart(shipping_tax_lines)
    const setShippingTaxLinesPromise = shippingTaxLinesData.length
      ? await cartService.setShippingMethodTaxLines(
          cart.id,
          shippingTaxLinesData
        )
      : 0

    const [existingShippingMethodTaxLines, existingLineItemTaxLines] =
      await Promise.all([
        getShippingTaxLinesPromise,
        getItemTaxLinesPromise,
        setItemTaxLinesPromise,
        setShippingTaxLinesPromise,
      ])

    return new StepResponse(null, {
      cart,
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
    })
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const { cart, existingLineItemTaxLines, existingShippingMethodTaxLines } =
      revertData

    const cartService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    if (existingLineItemTaxLines) {
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
