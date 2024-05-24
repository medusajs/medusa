import {
  AdminCreateInventoryLocationLevelType,
  AdminUpdateInventoryLocationLevelType,
} from "../../../validators"
import { MedusaRequest, MedusaResponse } from "../../../../../../types/routing"

import { bulkCreateDeleteLevelsWorkflow } from "@medusajs/core-flows"
import { BatchMethodRequest } from "@medusajs/types"

export const POST = async (
  req: MedusaRequest<
    BatchMethodRequest<
      AdminCreateInventoryLocationLevelType,
      AdminUpdateInventoryLocationLevelType
    >
  >,
  res: MedusaResponse
) => {
  const { id } = req.params

  // TODO: Normalize workflow and response, and add support for updates
  const workflow = bulkCreateDeleteLevelsWorkflow(req.scope)
  await workflow.run({
    input: {
      deletes:
        req.validatedBody.delete?.map((location_id) => ({
          location_id,
          inventory_item_id: id,
        })) ?? [],
      creates:
        req.validatedBody.create?.map((c) => ({
          ...c,
          inventory_item_id: id,
        })) ?? [],
    },
  })

  res.status(200).json({ inventory_item: {} })
}
