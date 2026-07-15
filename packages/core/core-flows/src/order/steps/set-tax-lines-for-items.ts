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

    // Capture the tax lines the compensation may need to restore. A "replace"
    // spans the whole order (so any entity's stale line can be restored), an
    // "upsert" only affects the entities referenced in the input, and a "none"
    // modifies nothing (so there's nothing to capture).
    const affectedItemIds =
      itemsOp === "replace" && order.items?.length
        ? order.items.map((i) => i.id)
        : item_tax_lines.map((t) => t.line_item_id)
    const affectedShippingIds =
      shippingOp === "replace" && order.shipping_methods?.length
        ? order.shipping_methods.map((s) => s.id)
        : shipping_tax_lines.map((t) => t.shipping_line_id)

    const [existingShippingMethodTaxLines, existingLineItemTaxLines] =
      await promiseAll([
        affectedShippingIds.length
          ? orderService.listOrderShippingMethodTaxLines({
              shipping_method_id: affectedShippingIds,
            })
          : [],
        affectedItemIds.length
          ? orderService.listOrderLineItemTaxLines({
              item_id: affectedItemIds,
            })
          : [],
      ])

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
      affectedItemIds,
      affectedShippingIds,
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
      affectedItemIds,
      affectedShippingIds,
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

    // Restore each entity to its pre-step state. Both "replace" and "upsert"
    // create new tax lines in the forward step, so the compensation must remove
    // whatever is currently attached before restoring the captured tax lines —
    // otherwise the created lines would be left behind.
    const revertItemTaxLines = async () => {
      if (itemsOp === "replace") {
        // Whole-order restore: also deletes the lines we set.
        await orderService.setOrderLineItemTaxLines(order.id, itemTaxLines)
      } else if (itemsOp === "upsert") {
        // The forward step's tax lines never carry an `id`, so the "upsert"
        // only ever inserts new rows (it never updates in place). We therefore
        // can't undo it by updating rows back; we delete every tax line
        // currently on the affected items (removing the inserted ones) and
        // recreate the captured pre-step snapshot.
        await orderService.deleteOrderLineItemTaxLines({
          item_id: affectedItemIds,
        })
        if (itemTaxLines.length) {
          await orderService.createOrderLineItemTaxLines(itemTaxLines)
        }
      }
    }

    const revertShippingTaxLines = async () => {
      if (shippingOp === "replace") {
        await orderService.setOrderShippingMethodTaxLines(
          order.id,
          shippingTaxLines
        )
      } else if (shippingOp === "upsert") {
        // See the note in revertItemTaxLines: the "upsert" only inserts, so we
        // delete the affected shipping methods' current tax lines and recreate
        // the captured pre-step snapshot rather than updating rows back.
        await orderService.deleteOrderShippingMethodTaxLines({
          shipping_method_id: affectedShippingIds,
        })
        if (shippingTaxLines.length) {
          await orderService.createOrderShippingMethodTaxLines(shippingTaxLines)
        }
      }
    }

    await promiseAll([revertItemTaxLines(), revertShippingTaxLines()])
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
