import { batchLinksWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { buildBatchVariantInventoryData } from "../../../../helpers"
import { AdminBatchVariantInventoryItemsType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBatchVariantInventoryItemsType>,
  res: MedusaResponse
) => {
  const { create = [], update = [], delete: toDelete = [] } = req.validatedBody

  const { result } = await batchLinksWorkflow(req.scope).run({
    input: {
      create: buildBatchVariantInventoryData(create),
      update: buildBatchVariantInventoryData(update),
      delete: buildBatchVariantInventoryData(toDelete),
    },
  })

  res.status(200).json({
    created: result.created,
    updated: result.updated,
    deleted: result.deleted,
  })
}
