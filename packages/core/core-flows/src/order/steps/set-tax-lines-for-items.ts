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
      ? orderService.upsertOrderLineItemTaxLines(itemsTaxLinesData)
      : void 0

    const shippingTaxLinesData =
      normalizeShippingTaxLinesForOrder(shipping_tax_lines)
    const setShippingTaxLinesPromise = shippingTaxLinesData.length
      ? await orderService.upsertOrderShippingMethodTaxLines(
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

    const { existingLineItemTaxLines, existingShippingMethodTaxLines } =
      revertData

    const orderService = container.resolve<IOrderModuleService>(Modules.ORDER)

    if (existingLineItemTaxLines) {
      await orderService.upsertOrderLineItemTaxLines(
        existingLineItemTaxLines.map((taxLine) => ({
          description: taxLine.description,
          tax_rate_id: taxLine.tax_rate_id,
          code: taxLine.code,
          rate: taxLine.rate,
          provider_id: taxLine.provider_id,
          item_id: taxLine.item_id,
          metadata: taxLine.metadata,
          data: taxLine.data,
        }))
      )
    }

    await orderService.upsertOrderShippingMethodTaxLines(
      existingShippingMethodTaxLines.map((taxLine) => ({
        description: taxLine.description,
        tax_rate_id: taxLine.tax_rate_id,
        code: taxLine.code,
        rate: taxLine.rate,
        provider_id: taxLine.provider_id,
        shipping_method_id: taxLine.shipping_method_id,
        metadata: taxLine.metadata,
        data: taxLine.data,
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
