import { addRulesToFulfillmentShippingOptionWorkflow } from "@medusajs/core-flows"
import { AdminShippingOptionRetrieveResponse } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminShippingOptionRulesBatchAddType } from "../../../../validators"
import { refetchShippingOption } from "../../../../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminShippingOptionRulesBatchAddType>,
  res: MedusaResponse<AdminShippingOptionRetrieveResponse>
) => {
  const id = req.params.id
  const workflow = addRulesToFulfillmentShippingOptionWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: {
      data: req.validatedBody.rules.map((rule) => ({
        ...rule,
        shipping_option_id: id,
      })),
    },
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
