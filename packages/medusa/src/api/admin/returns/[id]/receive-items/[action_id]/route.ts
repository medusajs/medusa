import {
  removeItemReceiveReturnActionWorkflow,
  updateReceiveItemReturnRequestWorkflow,
} from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminPostReturnsReceiveItemsActionReqSchemaType } from "../../../validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsReceiveItemsActionReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminReturnPreviewResponse>
) => {
  const { id, action_id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { result } = await updateReceiveItemReturnRequestWorkflow(
    req.scope
  ).run({
    input: {
      data: { ...req.validatedBody },
      return_id: id,
      action_id,
    },
  })

  const {
    data: [orderReturn],
  } = await query.graph({
    entryPoint: "return",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminReturnPreviewResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { id, action_id } = req.params

  const { result: orderPreview } = await removeItemReceiveReturnActionWorkflow(
    req.scope
  ).run({
    input: {
      return_id: id,
      action_id,
    },
  })

  const {
    data: [orderReturn],
  } = await query.graph({
    entryPoint: "return",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    order_preview: orderPreview as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
