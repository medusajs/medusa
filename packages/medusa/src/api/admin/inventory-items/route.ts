import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"

import { createInventoryItemsWorkflow } from "@medusajs/core-flows"
import { refetchInventoryItem } from "./helpers"
import {
  AdminCreateInventoryItemType,
  AdminGetInventoryItemsParamsType,
} from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateInventoryItemType>,
  res: MedusaResponse
) => {
  const { result } = await createInventoryItemsWorkflow(req.scope).run({
    input: { items: [req.validatedBody] },
  })

  const inventoryItem = await refetchInventoryItem(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ inventory_item: inventoryItem })
}

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetInventoryItemsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory_items",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: inventory_items, metadata } = await remoteQuery({
    ...query,
  })

  res.status(200).json({
    inventory_items,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
