import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"

import { InventoryTypes } from "@medusajs/framework/types"
import { createStep } from "@medusajs/framework/workflows-sdk"

export const validateInventoryLocationsStepId = "validate-inventory-levels-step"
/**
 * This step ensures that the inventory levels exist for each specified pair of inventory item and location.
 */
export const validateInventoryLocationsStep = createStep(
  validateInventoryLocationsStepId,
  async (data: InventoryTypes.CreateInventoryLevelInput[], { container }) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const stockLocations = await remoteQuery({
      entryPoint: "stock_location",
      variables: {
        id: data.map((d) => d.location_id),
      },
      fields: ["id"],
    })

    const diff = arrayDifference(
      data.map((d) => d.location_id),
      stockLocations.map((l) => l.id)
    )
    if (diff.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Stock locations with ids: ${diff.join(", ")} was not found`
      )
    }
  }
)
