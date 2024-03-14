import {
  ContainerRegistrationKeys,
  ManyToManyInventoryFeatureFlag,
  MedusaError,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { InventoryNext } from "@medusajs/types"

export const validateInventoryItemsForCreateStepId =
  "validate-inventory-items-for-create-step"
export const validateInventoryItemsForCreate = createStep(
  validateInventoryItemsForCreateStepId,
  async (input: InventoryNext.TaggedInventoryItem[], { container }) => {
    const featureFlagRouter = container.resolve(
      ContainerRegistrationKeys.FEATURE_FLAG_ROUTER
    )
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    if (
      featureFlagRouter.isFeatureEnabled(ManyToManyInventoryFeatureFlag.key)
    ) {
      return
    }

    const query = remoteQueryObjectFromString({
      entryPoint: "product_variant_inventory_item",
      variables: {
        variant_id: input.map((i) => i.tag),
      },
      fields: ["inventory_item_id", "variant_id"],
    })

    const existingItems = await remoteQuery(query)

    if (existingItems.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Inventory items already exist for variants with ids: " +
          existingItems.map((i) => i.variant_id).join(", ")
      )
    }

    return new StepResponse(input)
  }
)
