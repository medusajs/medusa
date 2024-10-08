import { batchLinksWorkflow } from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { buildBatchVariantInventoryData } from "../../../../helpers"
import { AdminBatchVariantInventoryItemsType } from "../../../../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminBatchVariantInventoryItemsType>,
  res: MedusaResponse<HttpTypes.AdminProductVariantInventoryBatchResponse>
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
  } as unknown as HttpTypes.AdminProductVariantInventoryBatchResponse)
}
