import {
  removeOrderEditShippingMethodWorkflow,
  updateOrderEditShippingMethodWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminPostOrderEditsShippingActionReqSchemaType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostOrderEditsShippingActionReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await updateOrderEditShippingMethodWorkflow(req.scope).run(
    {
      input: {
        data: { ...req.validatedBody },
        order_id: id,
        action_id,
      },
    }
  )

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderEdit] = await remoteQuery(queryObject)

  res.json({
    order_preview: result,
    order: orderEdit,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderEditPreviewResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

  const { result: orderPreview } = await removeOrderEditShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      order_id: id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })
  const [order] = await remoteQuery(queryObject)

  res.json({
    order_preview: orderPreview,
    order,
  })
}
