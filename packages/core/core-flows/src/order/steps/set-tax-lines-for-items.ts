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

type TaxLinesOp = "replace" | "upsert" | "none"

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

    // When the input covers the whole order (full recompute) and there are
    // computed tax lines, replace the order's tax lines so stale ones (e.g. from
    // a previous address/region) are removed instead of accumulating duplicates.
    // When the recompute yields no tax lines (e.g. the region has automatic
    // taxes disabled), fall back to a no-op so existing (e.g. manually set) tax
    // lines are preserved rather than wiped.
    const itemsOp: TaxLinesOp =
      is_full_replacement && itemsTaxLinesData.length
        ? "replace"
        : itemsTaxLinesData.length
        ? "upsert"
        : "none"

    const shippingOp: TaxLinesOp =
      is_full_replacement && shippingTaxLinesData.length
        ? "replace"
        : shippingTaxLinesData.length
        ? "upsert"
        : "none"

    await promiseAll([
      itemsOp === "replace"
        ? orderService.setOrderLineItemTaxLines(order.id, itemsTaxLinesData)
        : itemsOp === "upsert"
        ? orderService.upsertOrderLineItemTaxLines(itemsTaxLinesData)
        : Promise.resolve(void 0),
      shippingOp === "replace"
        ? orderService.setOrderShippingMethodTaxLines(
            order.id,
            shippingTaxLinesData
          )
        : shippingOp === "upsert"
        ? orderService.upsertOrderShippingMethodTaxLines(shippingTaxLinesData)
        : Promise.resolve(void 0),
    ])

    return new StepResponse(void 0, {
      order,
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
      itemsOp,
      shippingOp,
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
      itemsOp,
      shippingOp,
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

    await promiseAll([
      // Only undo the entities we actually modified. A "replace" is undone by
      // restoring the previous full set (which also removes the lines we set).
      itemsOp === "replace"
        ? orderService.setOrderLineItemTaxLines(order.id, itemTaxLines)
        : itemsOp === "upsert" && itemTaxLines.length
        ? orderService.upsertOrderLineItemTaxLines(itemTaxLines)
        : Promise.resolve(void 0),
      shippingOp === "replace"
        ? orderService.setOrderShippingMethodTaxLines(order.id, shippingTaxLines)
        : shippingOp === "upsert"
        ? orderService.upsertOrderShippingMethodTaxLines(shippingTaxLines)
        : Promise.resolve(void 0),
    ])
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
