import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { InventoryNext } from "@medusajs/types"
import { createStep } from "@medusajs/workflows-sdk"

export const validateInventoryLocationsStepId = "validate-inventory-levels-step"
export const validateInventoryLocationsStep = createStep(
  validateInventoryLocationsStepId,
  async (data: InventoryNext.CreateInventoryLevelInput[], { container }) => {
    const remoteQuery = container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const locationQuery = remoteQueryObjectFromString({
      entryPoint: "stock_location",
      variables: {
        id: data.map((d) => d.location_id),
      },
      fields: ["id"],
    })

    const stockLocations = await remoteQuery(locationQuery)

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
