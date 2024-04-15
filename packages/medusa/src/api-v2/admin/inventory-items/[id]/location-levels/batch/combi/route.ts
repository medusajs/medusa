import {
  AdminPostInventoryItemsItemLocationLevelsBatchReq,
  AdminPostInventoryItemsItemLocationLevelsReq,
} from "../../../../validators"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  MedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"

import { bulkCreateDeleteLevelsWorkflow } from "@medusajs/core-flows"
import { defaultAdminInventoryItemFields } from "../../../../query-config"

export const POST = async (
  req: MedusaRequest<AdminPostInventoryItemsItemLocationLevelsBatchReq>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const workflow = bulkCreateDeleteLevelsWorkflow(req.scope)
  const { errors } = await workflow.run({
    input: {
      deletes: req.validatedBody.deletes.map((location_id) => ({
        location_id,
        inventory_item_id: id,
      })),
      creates: req.validatedBody.creates.map((c) => ({
        ...c,
        inventory_item_id: id,
      })),
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
