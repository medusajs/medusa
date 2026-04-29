import {
  removeReturnShippingMethodWorkflow,
  updateReturnShippingMethodWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminOrderPreview, HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { defaultAdminDetailsReturnFields } from "../../../../../returns/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminExchangeUpdateInboundShipping,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminExchangePreviewResponse>
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [exchange] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_exchange",
      variables: {
        id,
      },
      fields: ["id", "return_id"],
    }),
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result } = await updateReturnShippingMethodWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      return_id: exchange.return_id,
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
    fields: req.queryConfig.fields,
  })

  const [orderExchange] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as AdminOrderPreview,
    exchange: orderExchange,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminExchangeReturnResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

  const [exchange] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_exchange",
      variables: {
        id,
      },
      fields: ["id", "return_id"],
    }),
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result: orderPreview } = await removeReturnShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      return_id: exchange.return_id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: exchange.return_id,
    },
    fields: defaultAdminDetailsReturnFields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: orderPreview as unknown as AdminOrderPreview,
    return: orderReturn,
  })
}
