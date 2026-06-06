import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to validate inventory items for creation.
 */
export type ValidateInventoryItemsForCreateStepInput = {
  /**
   * The ID of the variant to validate.
   */
  tag?: string
}[]

export const validateInventoryItemsForCreateStepId =
  "validate-inventory-items-for-create-step"
/**
 * This step checks whether a variant already has an inventory item.
 * If so, the step will throw an error.
 * 
 * @example
 * const data = validateInventoryItemsForCreate([
 *   {
 *     tag: "variant_123"
 *   }
 * ])
 */
export const validateInventoryItemsForCreate = createStep(
  validateInventoryItemsForCreateStepId,
  async (
    input: ValidateInventoryItemsForCreateStepInput,
    { container }
  ) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

    const linkService = remoteLink.getLinkModule(
      Modules.PRODUCT,
      "variant_id",
      Modules.INVENTORY,
      "inventory_item_id"
    )!

    const existingItems = await linkService.list(
      { variant_id: input.map((i) => i.tag) },
      { select: ["variant_id", "inventory_item_id"] }
    )

    if (existingItems.length) {
      // @ts-expect-error
      const ids = existingItems.map((i) => i.variant_id).join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Inventory items already exist for variants with ids: ${ids}`
      )
    }

    return new StepResponse(input)
  }
)
