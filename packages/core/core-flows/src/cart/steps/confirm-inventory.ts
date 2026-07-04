import type {
  BigNumberInput,
  IInventoryService,
} from "@medusajs/framework/types"
import {
  MathBN,
  MedusaError,
  Modules,
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

type InventoryLevelAvailability = {
  inventory_item_id: string
  location_id: string
  stocked_quantity?: BigNumberInput
  reserved_quantity?: BigNumberInput
  raw_stocked_quantity?: BigNumberInput
  raw_reserved_quantity?: BigNumberInput
}

/**
 * Mirrors the availability calculation in prepare-confirm-inventory-input and
 * inventoryLevelRepository.getAvailableQuantity (raw fields preferred).
 */
function getLevelAvailableQuantity(level: InventoryLevelAvailability) {
  return MathBN.sub(
    level.raw_stocked_quantity ?? level.stocked_quantity ?? 0,
    level.raw_reserved_quantity ?? level.reserved_quantity ?? 0
  )
}

export const confirmInventoryStepId = "confirm-inventory-step"
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

    const itemsToConfirm = data.items.filter((item) => !item.allow_backorder)

    if (itemsToConfirm.length) {
      const itemIds = itemsToConfirm.map((i) => i.inventory_item_id)

      const inventoryLevels = await inventoryService.listInventoryLevels(
        {
          inventory_item_id: itemIds,
        },
        {
          take: null,
          select: [
            "inventory_item_id",
            "location_id",
            "stocked_quantity",
            "reserved_quantity",
            "raw_stocked_quantity",
            "raw_reserved_quantity",
          ],
        }
      )

      const levelMap = new Map<string, InventoryLevelAvailability[]>()
      inventoryLevels.forEach((level) => {
        const levels = levelMap.get(level.inventory_item_id) || []
        levels.push(level)
        levelMap.set(level.inventory_item_id, levels)
      })

      const hasCoverage = itemsToConfirm.every((item) => {
        const levels = levelMap.get(item.inventory_item_id) || []
        const availableQuantity = levels
          .filter((level) => item.location_ids.includes(level.location_id))
          .reduce(
            (acc, level) => MathBN.add(acc, getLevelAvailableQuantity(level)),
            MathBN.convert(0)
          )

        const itemQuantity = MathBN.mult(item.quantity, item.required_quantity)
        return MathBN.gte(availableQuantity, itemQuantity)
      })

      if (!hasCoverage) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Some variant does not have the required inventory`,
          MedusaError.Codes.INSUFFICIENT_INVENTORY
        )
      }
    }

    return new StepResponse(null)
  }
)
