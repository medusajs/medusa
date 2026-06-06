import {
  deleteShippingOptionsWorkflow,
  updateShippingOptionsWorkflow,
} from "@zjedene-medusa/core-flows"
import { FulfillmentWorkflow, HttpTypes } from "@zjedene-medusa/framework/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { refetchShippingOption } from "../helpers"
import { MedusaError } from "@zjedene-medusa/framework/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminGetShippingOptionParams>,
  res: MedusaResponse<HttpTypes.AdminShippingOptionResponse>
) => {
  const shippingOption = await refetchShippingOption(
    req.params.id,
    req.scope,
    req.queryConfig.fields
  )

  if (!shippingOption) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Shipping Option with id: ${req.params.id} not found`
    )
  }

  res.json({ shipping_option: shippingOption })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminUpdateShippingOption,
    HttpTypes.AdminGetShippingOptionParams
  >,
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
    req.queryConfig.fields
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
