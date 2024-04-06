import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import { AdminPostInventoryItemsReq } from "./validators"
import { createInventoryItemsWorkflow } from "@medusajs/core-flows"

// Create inventory-item
export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostInventoryItemsReq>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await createInventoryItemsWorkflow(req.scope).run({
    input: { items: [req.validatedBody] },
  })

  const [inventory_item] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "inventory_items",
      variables: {
        id: result[0].id,
      },
      fields: req.remoteQueryConfig.fields,
    })
  )

  res.status(200).json({ inventory_item })
}

// List inventory-items
export const GET = async (
  req: AuthenticatedMedusaRequest,
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
