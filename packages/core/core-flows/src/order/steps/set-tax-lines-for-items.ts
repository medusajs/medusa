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

/**
 * The details of setting tax lines for an order's items and shipping methods.
 */
export interface SetOrderTaxLinesForItemsStepInput {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The tax lines to set for the order's items.
   */
  item_tax_lines: ItemTaxLineDTO[]
  /**
   * The tax lines to set for the order's shipping methods.
   */
  shipping_tax_lines: ShippingTaxLineDTO[]
  /**
   * Whether the provided tax lines cover the entire order. When enabled, the
   * order's tax lines are replaced (stale tax lines not included in the input
   * are deleted) instead of being upserted. Use this for full-order recomputes
   * so that changing the tax jurisdiction doesn't leave stale tax lines behind.
   */
  is_full_replacement?: boolean
}

export const setOrderTaxLinesForItemsStepId = "set-order-tax-lines-for-items"
/**
 * This step sets the tax lines of an order's items and shipping methods.
 *
 * :::note
 *
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = setOrderTaxLinesForItemsStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   item_tax_lines: [
 *     {
 *       line_item_id: "orli_123",
 *       rate: 0.25,
 *       code: "VAT",
 *       name: "VAT",
 *       provider_id: "tax_provider_123",
 *     }
 *   ]
 * })
 */
export const setOrderTaxLinesForItemsStep = createStep(
  setOrderTaxLinesForItemsStepId,
  async (data: SetOrderTaxLinesForItemsStepInput, { container }) => {
    const { order, item_tax_lines, shipping_tax_lines, is_full_replacement } =
      data
    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

    const [existingShippingMethodTaxLines, existingLineItemTaxLines] =
      await promiseAll([
        orderService.listOrderShippingMethodTaxLines({
          shipping_method_id: shipping_tax_lines.map((t) => t.shipping_line_id),
        }),
        orderService.listOrderLineItemTaxLines({
          item_id: item_tax_lines.map((t) => t.line_item_id),
        }),
      ])

    const itemsTaxLinesData = normalizeItemTaxLinesForOrder(item_tax_lines)
    const shippingTaxLinesData =
      normalizeShippingTaxLinesForOrder(shipping_tax_lines)

    if (is_full_replacement) {
      // The input covers the whole order, so replace the order's tax lines.
      // This removes stale tax lines (e.g. from a previous address/region)
      // instead of accumulating duplicates as an upsert would.
      await promiseAll([
        orderService.setOrderLineItemTaxLines(order.id, itemsTaxLinesData),
        orderService.setOrderShippingMethodTaxLines(
          order.id,
          shippingTaxLinesData
        ),
      ])
    } else {
      await promiseAll([
        itemsTaxLinesData.length
          ? orderService.upsertOrderLineItemTaxLines(itemsTaxLinesData)
          : Promise.resolve(void 0),
        shippingTaxLinesData.length
          ? orderService.upsertOrderShippingMethodTaxLines(shippingTaxLinesData)
          : Promise.resolve(void 0),
      ])
    }

    return new StepResponse(void 0, {
      order,
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
      is_full_replacement,
    })
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const {
      order,
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
      is_full_replacement,
    } = revertData

    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

    const itemTaxLines = (existingLineItemTaxLines ?? []).map((taxLine) => ({
      description: taxLine.description,
      tax_rate_id: taxLine.tax_rate_id,
      code: taxLine.code,
      rate: taxLine.rate,
      provider_id: taxLine.provider_id,
      item_id: taxLine.item_id,
      metadata: taxLine.metadata,
      data: taxLine.data,
    }))

    const shippingTaxLines = (existingShippingMethodTaxLines ?? []).map(
      (taxLine) => ({
        description: taxLine.description,
        tax_rate_id: taxLine.tax_rate_id,
        code: taxLine.code,
        rate: taxLine.rate,
        provider_id: taxLine.provider_id,
        shipping_method_id: taxLine.shipping_method_id,
        metadata: taxLine.metadata,
        data: taxLine.data,
      })
    )

    if (is_full_replacement) {
      await promiseAll([
        orderService.setOrderLineItemTaxLines(order.id, itemTaxLines),
        orderService.setOrderShippingMethodTaxLines(order.id, shippingTaxLines),
      ])
    } else {
      if (itemTaxLines.length) {
        await orderService.upsertOrderLineItemTaxLines(itemTaxLines)
      }

      await orderService.upsertOrderShippingMethodTaxLines(shippingTaxLines)
    }
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
    data: taxLine.data,
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
    data: taxLine.data,
  }))
}
