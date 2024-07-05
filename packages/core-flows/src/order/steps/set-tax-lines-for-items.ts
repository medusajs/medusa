import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateLineItemTaxLineDTO,
  CreateShippingMethodTaxLineDTO,
  IOrderModuleService,
  ItemTaxLineDTO,
  OrderDTO,
  ShippingTaxLineDTO,
} from "@medusajs/types"
import { promiseAll } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  order: OrderDTO
  item_tax_lines: ItemTaxLineDTO[]
  shipping_tax_lines: ShippingTaxLineDTO[]
}

export const setOrderTaxLinesForItemsStepId = "set-order-tax-lines-for-items"
export const setOrderTaxLinesForItemsStep = createStep(
  setOrderTaxLinesForItemsStepId,
  async (data: StepInput, { container }) => {
    const { order, item_tax_lines, shipping_tax_lines } = data
    const orderService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const getShippingTaxLinesPromise =
      await orderService.listShippingMethodTaxLines({
        shipping_method_id: shipping_tax_lines.map((t) => t.shipping_line_id),
      })

    const getItemTaxLinesPromise = await orderService.listLineItemTaxLines({
      item_id: item_tax_lines.map((t) => t.line_item_id),
    })

    const itemsTaxLinesData = normalizeItemTaxLinesForOrder(item_tax_lines)
    const setItemTaxLinesPromise = itemsTaxLinesData.length
      ? orderService.setLineItemTaxLines(order.id, itemsTaxLinesData)
      : void 0

    const shippingTaxLinesData =
      normalizeShippingTaxLinesForOrder(shipping_tax_lines)
    const setShippingTaxLinesPromise = shippingTaxLinesData.length
      ? await orderService.setShippingMethodTaxLines(
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

    const orderService = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    if (existingLineItemTaxLines) {
      await orderService.setLineItemTaxLines(
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

    await orderService.setShippingMethodTaxLines(
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
