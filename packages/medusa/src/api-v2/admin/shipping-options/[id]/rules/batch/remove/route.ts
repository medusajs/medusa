import { removeRulesFromFulfillmentShippingOptionWorkflow } from "@medusajs/core-flows"
import { AdminShippingOptionRetrieveResponse } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminShippingOptionRulesBatchRemoveType } from "../../../../validators"
import { refetchShippingOption } from "../../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminShippingOptionRulesBatchRemoveType>,
  res: MedusaResponse<AdminShippingOptionRetrieveResponse>
) => {
  const workflow = removeRulesFromFulfillmentShippingOptionWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { ids: req.validatedBody.rule_ids },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const shippingOption = await refetchShippingOption(
    req.params.id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ shipping_option: shippingOption })
}
