import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { BatchMethodRequest, HttpTypes } from "@medusajs/framework/types"
import { refetchBatchRules } from "../../../helpers"
import { batchShippingOptionRulesWorkflow } from "@medusajs/core-flows"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    BatchMethodRequest<
      HttpTypes.AdminCreateShippingOptionRule,
      HttpTypes.AdminUpdateShippingOptionRule
    >
  >,
  res: MedusaResponse<HttpTypes.AdminUpdateShippingOptionRulesResponse>
) => {
  const id = req.params.id
  const { result } = await batchShippingOptionRulesWorkflow(req.scope).run({
    input: {
      create: req.validatedBody.create?.map((c) => ({
        ...c,
        shipping_option_id: id,
      })),
      update: req.validatedBody.update,
      delete: req.validatedBody.delete,
    },
  })

  const batchResults = await refetchBatchRules(
    result,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res
    .status(200)
    .json(
      batchResults as unknown as HttpTypes.AdminUpdateShippingOptionRulesResponse
    )
}
