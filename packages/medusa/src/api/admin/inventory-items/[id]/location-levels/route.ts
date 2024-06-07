import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"

import { createInventoryLevelsWorkflow } from "@medusajs/core-flows"
import {
  AdminCreateInventoryLocationLevelType,
  AdminGetInventoryLocationLevelsParamsType,
} from "../../validators"
import { refetchInventoryItem } from "../../helpers"

export const POST = async (
  req: MedusaRequest<AdminCreateInventoryLocationLevelType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const workflow = createInventoryLevelsWorkflow(req.scope)
  await workflow.run({
    input: {
      inventory_levels: [
        {
          ...req.validatedBody,
          inventory_item_id: id,
        },
      ],
    },
  })

  const inventoryItem = await refetchInventoryItem(
    id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ inventory_item: inventoryItem })
}

export const GET = async (
  req: MedusaRequest<AdminGetInventoryLocationLevelsParamsType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory_levels",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
      inventory_item_id: id,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: inventory_levels, metadata } = await remoteQuery(query)

  res.status(200).json({
    inventory_levels,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
