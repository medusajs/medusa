import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CartWorkflowDTO,
  CreateLineItemTaxLineDTO,
  CreateShippingMethodTaxLineDTO,
  ICartModuleService,
  ItemTaxLineDTO,
  ShippingTaxLineDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  cart: CartWorkflowDTO
  taxLines: (ItemTaxLineDTO | ShippingTaxLineDTO)[]
}

function getItemTaxLines(
  taxLines: (ItemTaxLineDTO | ShippingTaxLineDTO)[]
): ItemTaxLineDTO[] {
  return taxLines.filter(
    (taxLine): taxLine is ItemTaxLineDTO => "line_item_id" in taxLine
  )
}

function getShippingMethodTaxLines(
  taxLines: (ItemTaxLineDTO | ShippingTaxLineDTO)[]
): ShippingTaxLineDTO[] {
  return taxLines.filter(
    (taxLine): taxLine is ShippingTaxLineDTO => "shipping_line_id" in taxLine
  )
}

function commonTaxLineAttributes(taxLine: ItemTaxLineDTO | ShippingTaxLineDTO) {
  return {
    description: taxLine.name,
    tax_rate_id: taxLine.rate_id,
    code: taxLine.code!,
    rate: taxLine.rate!,
    provider_id: taxLine.provider_id,
  }
}

function normalizeItemTaxLinesForCart(
  taxLines: ItemTaxLineDTO[]
): CreateLineItemTaxLineDTO[] {
  return taxLines.map((taxLine) => ({
    ...commonTaxLineAttributes(taxLine),
    item_id: taxLine.line_item_id,
  }))
}

function normalizeShippingTaxLinesForCart(
  taxLines: ShippingTaxLineDTO[]
): CreateShippingMethodTaxLineDTO[] {
  return taxLines.map((taxLine) => ({
    ...commonTaxLineAttributes(taxLine),
    item_id: taxLine.shipping_line_id,
  }))
}

export const setTaxLinesForItemsStepId = "set-tax-lines-for-items"
export const setTaxLinesForItemsStep = createStep(
  setTaxLinesForItemsStepId,
  async (data: StepInput, { container }) => {
    const { cart, taxLines } = data
    const cartService = container.resolve<ICartModuleService>(
      ModuleRegistrationName.CART
    )

    const shippingMethodTaxLines = getShippingMethodTaxLines(taxLines)
    const lineItemTaxLines = getItemTaxLines(taxLines)

    const existingShippingMethodTaxLines =
      await cartService.listShippingMethodTaxLines({
        shipping_method_id: shippingMethodTaxLines.map(
          (t) => t.shipping_line_id
        ),
      })

    const existingLineItemTaxLines = await cartService.listLineItemTaxLines({
      item_id: lineItemTaxLines.map((t) => t.line_item_id),
    })

    await cartService.setLineItemTaxLines(
      cart.id,
      normalizeItemTaxLinesForCart(lineItemTaxLines)
    )

    await cartService.setShippingMethodTaxLines(
      cart.id,
      normalizeShippingTaxLinesForCart(shippingMethodTaxLines)
    )

    return new StepResponse(taxLines, {
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

    // TODO: fix these types
    await cartService.setLineItemTaxLines(
      cart.id,
      normalizeItemTaxLinesForCart(existingLineItemTaxLines as any)
    )

    await cartService.setShippingMethodTaxLines(
      cart.id,
      normalizeShippingTaxLinesForCart(existingShippingMethodTaxLines as any)
    )
  }
)
