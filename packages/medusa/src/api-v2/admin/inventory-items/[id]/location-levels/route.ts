import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

import { AdminPostInventoryItemsItemLocationLevelsReq } from "../../validators"
import { MedusaError } from "@medusajs/utils"
import { createInventoryLevelsWorkflow } from "@medusajs/core-flows"
import { defaultAdminInventoryItemFields } from "../../query-config"

export const POST = async (
  req: MedusaRequest<AdminPostInventoryItemsItemLocationLevelsReq>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const locationId = req.validatedBody.location_id

  const locationQuery = remoteQueryObjectFromString({
    entryPoint: "stock_location",
    variables: {
      id: locationId,
    },
    fields: ["id"],
  })

  const [stock_location] = await remoteQuery(locationQuery)

  if (!stock_location) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Stock location with id: ${locationId} not found`
    )
  }

  const workflow = createInventoryLevelsWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      inventory_levels: [
        {
          inventory_item_id: id,
          ...req.validatedBody,
        },
      ],
    },
  })

  // TODO: validate errors of workflow

  const itemQuery = remoteQueryObjectFromString({
    entryPoint: "inventory_items",
    variables: {
      id,
    },
    fields: defaultAdminInventoryItemFields,
  })

  const [inventory_item] = await remoteQuery(itemQuery)

  res.status(200).json({ inventory_item })
}
