import {
  removeItemExchangeActionWorkflow,
  updateExchangeAddItemWorkflow,
} from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminPostExchangesItemsActionReqSchemaType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostExchangesItemsActionReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminExchangePreviewResponse>
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await updateExchangeAddItemWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      exchange_id: id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchange",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderExchange] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    exchange: orderExchange,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminExchangePreviewResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

  const { result: orderPreview } = await removeItemExchangeActionWorkflow(
    req.scope
  ).run({
    input: {
      exchange_id: id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchange",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })
  const [orderExchange] = await remoteQuery(queryObject)

  res.json({
    order_preview: orderPreview as unknown as HttpTypes.AdminOrderPreview,
    exchange: orderExchange,
  })
}
