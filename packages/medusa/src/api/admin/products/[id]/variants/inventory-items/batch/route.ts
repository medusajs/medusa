import { batchLinksWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { buildBatchVariantInventoryData } from "../../../../helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminBatchVariantInventoryItems
  >,
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
