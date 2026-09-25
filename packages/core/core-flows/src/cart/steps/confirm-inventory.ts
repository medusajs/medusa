import type {
  BigNumberInput,
  IInventoryService,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
  promiseAll,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The details of the cart items to confirm their inventory availability.
 */
export interface ConfirmVariantInventoryStepInput {
  /**
   * The items to confirm inventory for.
   */
  items: {
    /**
     * The ID of the inventory item associated with the line item's variant.
     */
    inventory_item_id: string
    /**
     * The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
     * value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
     */
    required_quantity: number
    /**
     * Whether the variant can be ordered even if it's out of stock. If a variant has this enabled, the step doesn't throw an error.
     */
    allow_backorder: boolean
    /**
     * The quantity in the cart.
     */
    quantity: BigNumberInput
    /**
     * The ID of the stock locations that the inventory quantity is available in.
     */
    location_ids: string[]
  }[]
}

export const confirmInventoryStepId = "confirm-inventory-step"

export const aggregateConfirmInventoryItems = (
  items: ConfirmVariantInventoryStepInput["items"]
) => {
  const requests = new Map<
    string,
    {
      inventory_item_id: string
      location_ids: string[]
      quantity: BigNumberInput
    }
  >()

  for (const item of items) {
    if (item.allow_backorder) {
      continue
    }

    const quantity = MathBN.mult(item.quantity, item.required_quantity)
    const request = requests.get(item.inventory_item_id)

    if (request) {
      request.quantity = MathBN.add(request.quantity, quantity)
      request.location_ids = Array.from(
        new Set([...request.location_ids, ...item.location_ids])
      )
      continue
    }

    requests.set(item.inventory_item_id, {
      inventory_item_id: item.inventory_item_id,
      location_ids: [...item.location_ids],
      quantity,
    })
  }

  return Array.from(requests.values())
}

/**
 * This step validates that items in the cart have sufficient inventory quantity.
 * If an item doesn't have sufficient inventory, an error is thrown.
 *
 * @example
 * confirmInventoryStep({
 *   items: [
 *     {
 *       inventory_item_id: "iitem_123",
 *       required_quantity: 1,
 *       allow_backorder: false,
 *       quantity: 1,
 *       location_ids: ["sloc_123"]
 *     }
 *   ]
 * })
 */
export const confirmInventoryStep = createStep(
  confirmInventoryStepId,
  async (data: ConfirmVariantInventoryStepInput, { container }) => {
    if (!data.items?.length) {
      return new StepResponse([], [])
    }

    const inventoryService = container.resolve<IInventoryService>(
      Modules.INVENTORY
    )

    const promises = aggregateConfirmInventoryItems(data.items).map((item) =>
      inventoryService.confirmInventory(
        item.inventory_item_id,
        item.location_ids,
        item.quantity
      )
    )

    const inventoryCoverage = await promiseAll(promises)

    if (inventoryCoverage.some((hasCoverage) => !hasCoverage)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Some variant does not have the required inventory`,
        MedusaError.Codes.INSUFFICIENT_INVENTORY
      )
    }

    return new StepResponse(null)
  }
)
