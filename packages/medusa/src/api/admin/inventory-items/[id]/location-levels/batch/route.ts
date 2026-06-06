import { MedusaRequest, MedusaResponse } from "@zjedene-medusa/framework/http"
import { batchInventoryItemLevelsWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/types"

export const POST = async (
  req: MedusaRequest<HttpTypes.AdminBatchInventoryItemLocationLevels>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const workflow = batchInventoryItemLevelsWorkflow(req.scope)
  const output = await workflow.run({
    input: {
      delete: req.validatedBody.delete ?? [],
      create:
        req.validatedBody.create?.map((c) => ({
          ...c,
          inventory_item_id: id,
        })) ?? [],
      update:
        req.validatedBody.update?.map((u) => ({
          ...u,
          inventory_item_id: id,
        })) ?? [],
      force: req.validatedBody.force ?? false,
    },
  })

  res.status(200).json({
    created: output.result.created,
    updated: output.result.updated,
    deleted: output.result.deleted,
  })
}
