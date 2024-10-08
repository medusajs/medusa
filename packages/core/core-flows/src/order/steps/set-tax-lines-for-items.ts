import {
  CreateLineItemTaxLineDTO,
  CreateShippingMethodTaxLineDTO,
  IOrderModuleService,
  ItemTaxLineDTO,
  OrderDTO,
  ShippingTaxLineDTO,
} from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface SetOrderTaxLinesForItemsStepInput {
  order: OrderDTO
  item_tax_lines: ItemTaxLineDTO[]
  shipping_tax_lines: ShippingTaxLineDTO[]
}

export const setOrderTaxLinesForItemsStepId = "set-order-tax-lines-for-items"
/**
 * This step sets the tax lines of an order's items and shipping methods.
 */
export const setOrderTaxLinesForItemsStep = createStep(
  setOrderTaxLinesForItemsStepId,
  async (data: SetOrderTaxLinesForItemsStepInput, { container }) => {
    const { order, item_tax_lines, shipping_tax_lines } = data
    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

    const getShippingTaxLinesPromise =
      await orderService.listOrderShippingMethodTaxLines({
        shipping_method_id: shipping_tax_lines.map((t) => t.shipping_line_id),
      })

    const getItemTaxLinesPromise = await orderService.listOrderLineItemTaxLines(
      {
        item_id: item_tax_lines.map((t) => t.line_item_id),
      }
    )

    const itemsTaxLinesData = normalizeItemTaxLinesForOrder(item_tax_lines)
    const setItemTaxLinesPromise = itemsTaxLinesData.length
      ? orderService.setOrderLineItemTaxLines(order.id, itemsTaxLinesData)
      : void 0

    const shippingTaxLinesData =
      normalizeShippingTaxLinesForOrder(shipping_tax_lines)
    const setShippingTaxLinesPromise = shippingTaxLinesData.length
      ? await orderService.setOrderShippingMethodTaxLines(
          order.id,
          shippingTaxLinesData
        )
      : void 0

    const [existingShippingMethodTaxLines, existingLineItemTaxLines] =
      await promiseAll([
        getShippingTaxLinesPromise,
        getItemTaxLinesPromise,
        setItemTaxLinesPromise,
        setShippingTaxLinesPromise,
      ])

    return new StepResponse(void 0, {
      order,
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
    })
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const { order, existingLineItemTaxLines, existingShippingMethodTaxLines } =
      revertData

    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (existingLineItemTaxLines) {
      await orderService.setOrderLineItemTaxLines(
        order.id,
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

    await orderService.setOrderShippingMethodTaxLines(
      order.id,
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

function normalizeItemTaxLinesForOrder(
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

function normalizeShippingTaxLinesForOrder(
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
