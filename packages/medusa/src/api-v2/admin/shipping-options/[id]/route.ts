import {
  AdminShippingOptionDeleteResponse,
  AdminShippingOptionRetrieveResponse,
  FulfillmentWorkflow,
} from "@medusajs/types"
import { AdminUpdateShippingOptionType } from "../validators"
import {
  deleteShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { refetchShippingOption } from "../helpers"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminUpdateShippingOptionType>,
  res: MedusaResponse<AdminShippingOptionRetrieveResponse>
) => {
  const shippingOptionPayload = req.validatedBody

  const workflow = updateShippingOptionsWorkflow(req.scope)

  const workflowInput: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput =
    {
      id: req.params.id,
      ...shippingOptionPayload,
    }

  const { result, errors } = await workflow.run({
    input: [workflowInput],
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const shippingOption = await refetchShippingOption(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ shipping_option: shippingOption })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<AdminShippingOptionDeleteResponse>
) => {
  const shippingOptionId = req.params.id

  const workflow = deleteShippingOptionsWorkflow(req.scope)

  const { errors } = await workflow.run({
    input: { ids: [shippingOptionId] },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res
    .status(200)
    .json({ id: shippingOptionId, object: "shipping_option", deleted: true })
}
