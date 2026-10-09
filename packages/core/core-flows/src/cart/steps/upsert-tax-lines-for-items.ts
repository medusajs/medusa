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
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the tax lines to set in a cart.
 */
export interface SetTaxLinesForItemsStepInput {
  /**
   * The cart's details.
   */
  cart: CartWorkflowDTO
  /**
   * The tax lines to set for line items.
   */
  item_tax_lines: ItemTaxLineDTO[]
  /**
   * The tax lines to set for shipping methods.
   */
  shipping_tax_lines: ShippingTaxLineDTO[]
}

export const upsertTaxLinesForItemsStepId = "set-tax-lines-for-items"
/**
 * This step sets the tax lines of shipping methods and line items in a cart.
 *
 * :::tip
 *
 * You can use the {@link retrieveCartStep} to retrieve a cart's details.
 *
 * :::
 *
 * @example
 * const data = upsertTaxLinesForItemsStep({
 *   // retrieve the details of the cart from another workflow
 *   // or in another step using the Cart Module's service
 *   cart,
 *   "item_tax_lines": [{
 *     "rate": 48,
 *     "code": "CODE123",
 *     "name": "Tax rate 2",
 *     "provider_id": "provider_1",
 *     "line_item_id": "litem_123"
 *   }],
 *   "shipping_tax_lines": [{
 *     "rate": 49,
 *     "code": "CODE456",
 *     "name": "Tax rate 1",
 *     "provider_id": "provider_1",
 *     "shipping_line_id": "sm_123"
 *   }]
 * })
 */
export const upsertTaxLinesForItemsStep = createStep(
  upsertTaxLinesForItemsStepId,
  async (data: SetTaxLinesForItemsStepInput, { container }) => {
    const { cart, item_tax_lines, shipping_tax_lines } = data
    const cartService = container.resolve<ICartModuleService>(Modules.CART)

    // The entities this step writes tax lines for. The compensation needs them:
    // the normalized tax lines below carry an `id` only when the entity already
    // had a tax line, so the upsert inserts rows that the revert has to find
    // again in order to remove them.
    const affectedItemIds = item_tax_lines.map((t) => t.line_item_id)
    const affectedShippingIds = shipping_tax_lines.map(
      (t) => t.shipping_line_id
    )

    const [existingShippingMethodTaxLines, existingLineItemTaxLines] =
      await promiseAll([
        affectedShippingIds.length
          ? cartService.listShippingMethodTaxLines({
              shipping_method_id: affectedShippingIds,
            })
          : [],

        affectedItemIds.length
          ? cartService.listLineItemTaxLines({
              item_id: affectedItemIds,
            })
          : [],
      ])

    const itemsTaxLinesData = normalizeItemTaxLinesForCart(
      item_tax_lines,
      existingLineItemTaxLines
    )
    const shippingTaxLinesData = normalizeShippingTaxLinesForCart(
      shipping_tax_lines,
      existingShippingMethodTaxLines
    )

    await promiseAll([
      itemsTaxLinesData.length
        ? cartService.upsertLineItemTaxLines(itemsTaxLinesData)
        : [],
      shippingTaxLinesData.length
        ? cartService.upsertShippingMethodTaxLines(shippingTaxLinesData)
        : [],
    ])

    return new StepResponse(null, {
      cart,
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
      affectedItemIds,
      affectedShippingIds,
    })
  },
  async (revertData, { container }) => {
    if (!revertData) {
      return
    }

    const {
      existingLineItemTaxLines,
      existingShippingMethodTaxLines,
      affectedItemIds,
      affectedShippingIds,
    } = revertData

    const cartService = container.resolve<ICartModuleService>(Modules.CART)

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

    // Restore each affected entity to its pre-step state. The forward step
    // inserts a new tax line for every incoming line beyond the first one an
    // entity already had, and upserting the captured snapshot back cannot undo
    // that: the snapshot carries no `id` either, so it inserts a second copy of
    // every pre-step line and leaves the step's own rows in place. A cart's tax
    // lines therefore multiplied on every failed run. Delete whatever is
    // currently attached to the affected entities — which removes the rows the
    // step inserted — and recreate the captured snapshot instead. Mirrors
    // setOrderTaxLinesForItemsStep's compensation.
    const revertItemTaxLines = async () => {
      if (!affectedItemIds?.length) {
        return
      }

      const current = await cartService.listLineItemTaxLines(
        { item_id: affectedItemIds },
        { select: ["id"] }
      )

      if (current.length) {
        await cartService.deleteLineItemTaxLines(current.map((t) => t.id))
      }

      if (itemTaxLines.length) {
        await cartService.addLineItemTaxLines(itemTaxLines)
      }
    }

    const revertShippingTaxLines = async () => {
      if (!affectedShippingIds?.length) {
        return
      }

      const current = await cartService.listShippingMethodTaxLines(
        { shipping_method_id: affectedShippingIds },
        { select: ["id"] }
      )

      if (current.length) {
        await cartService.deleteShippingMethodTaxLines(
          current.map((t) => t.id)
        )
      }

      if (shippingTaxLines.length) {
        await cartService.addShippingMethodTaxLines(shippingTaxLines)
      }
    }

    await promiseAll([revertItemTaxLines(), revertShippingTaxLines()])
  }
)

function normalizeItemTaxLinesForCart(
  taxLines: ItemTaxLineDTO[],
  existingTaxLines: LineItemTaxLineDTO[]
): CreateLineItemTaxLineDTO[] {
  return taxLines.map((taxLine: ItemTaxLineDTO & { id?: string }) => ({
    id: existingTaxLines.find((t) => t.item_id === taxLine.line_item_id)?.id,
    description: taxLine.name,
    tax_rate_id: taxLine.rate_id,
    code: taxLine.code!,
    rate: taxLine.rate!,
    provider_id: taxLine.provider_id,
    item_id: taxLine.line_item_id,
    data: taxLine.data,
  }))
}

function normalizeShippingTaxLinesForCart(
  taxLines: ShippingTaxLineDTO[],
  existingTaxLines: ShippingMethodTaxLineDTO[]
): CreateShippingMethodTaxLineDTO[] {
  return taxLines.map((taxLine: ShippingTaxLineDTO & { id?: string }) => ({
    id: existingTaxLines.find(
      (t) => t.shipping_method_id === taxLine.shipping_line_id
    )?.id,
    description: taxLine.name,
    tax_rate_id: taxLine.rate_id,
    code: taxLine.code!,
    rate: taxLine.rate!,
    provider_id: taxLine.provider_id,
    shipping_method_id: taxLine.shipping_line_id,
    data: taxLine.data,
  }))
}
