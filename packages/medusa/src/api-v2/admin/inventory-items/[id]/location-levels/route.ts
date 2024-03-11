import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

import { AdminPostInventoryItemsItemLocationLevelsReq } from "../../validators"

export const POST = (
  req: MedusaRequest<AdminPostInventoryItemsItemLocationLevelsReq>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const locationId = req.validatedBody.location_id

  const query = remoteQueryObjectFromString({
    entryPoint: "stock_location",
    variables: {
      id: locationId,
    },
    fields: ["id"],
  })

  const { stock_location } = remoteQuery(query)

  console.warn(stock_location)
}
