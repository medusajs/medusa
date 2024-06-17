import {
  deleteShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import { FulfillmentWorkflow, HttpTypes } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchShippingOption } from "../helpers"
import { AdminUpdateShippingOptionType } from "../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateShippingOptionType>,
  res: MedusaResponse<HttpTypes.AdminShippingOptionResponse>
) => {
  const shippingOptionPayload = req.validatedBody

  const workflow = updateShippingOptionsWorkflow(req.scope)

  const workflowInput: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput =
    {
      id: req.params.id,
      ...shippingOptionPayload,
    }

  const { result } = await workflow.run({
    input: [workflowInput],
  })

  const shippingOption = await refetchShippingOption(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ shipping_option: shippingOption })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminShippingOptionDeleteResponse>
) => {
  const shippingOptionId = req.params.id

  const workflow = deleteShippingOptionsWorkflow(req.scope)

  await workflow.run({
    input: { ids: [shippingOptionId] },
  })

  res
    .status(200)
    .json({ id: shippingOptionId, object: "shipping_option", deleted: true })
}
