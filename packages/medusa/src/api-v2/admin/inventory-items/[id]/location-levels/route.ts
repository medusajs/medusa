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

  const workflow = createInventoryLevelsWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: {
      inventory_levels: [
        {
          inventory_item_id: id,
          ...req.validatedBody,
        },
      ],
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

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

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const query = remoteQueryObjectFromString({
    entryPoint: "inventory_levels",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
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
