import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@zjedene-medusa/framework/utils"

import type { InventoryTypes } from "@zjedene-medusa/framework/types"
import { createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to validate the inventory levels.
 */
export type ValidateInventoryLocationsStepInput =
  InventoryTypes.CreateInventoryLevelInput[]

export const validateInventoryLocationsStepId = "validate-inventory-levels-step"
/**
 * This step ensures that the inventory levels exist for each
 * specified pair of inventory item and location. If not,
 * the step will throw an error.
 */
export const validateInventoryLocationsStep = createStep(
  validateInventoryLocationsStepId,
  async (data: ValidateInventoryLocationsStepInput, { container }) => {
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
