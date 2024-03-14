import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { CreateInventoryLevelInput } from "@medusajs/types"
import { createStep } from "@medusajs/workflows-sdk"

export const validateInventoryLocationsStepId = "validate-inventory-levels-step"
export const validateInventoryLocationsStep = createStep(
  validateInventoryLocationsStepId,
  async (data: CreateInventoryLevelInput[], { container }) => {
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

    const stock_location = await remoteQuery(locationQuery)

    const diff = arrayDifference(
      data.map((d) => d.location_id),
      stock_location.map((l) => l.id)
    )
    if (diff.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Stock locations with ids: ${diff.join(", ")} was not found`
      )
    }
  }
)
