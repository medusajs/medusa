import {
  cancelBeginOrderExchangeWorkflow,
  confirmExchangeRequestWorkflow,
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
import { defaultAdminDetailsReturnFields } from "../../../returns/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminExchangeRequestResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await confirmExchangeRequestWorkflow(req.scope).run({
    input: {
      exchange_id: id,
      confirmed_by: req.auth_context.actor_id,
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

  const [orderExchange] = await remoteQuery(queryObject, {
    throwIfKeyNotFound: true,
  })

  let orderReturn
  if (orderExchange.return_id) {
    const [orderReturnData] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "return",
        variables: {
          id: orderExchange.return_id,
        },
        fields: defaultAdminDetailsReturnFields,
      })
    )
    orderReturn = orderReturnData
  }

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    exchange: orderExchange,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminExchangeDeleteResponse>
) => {
  const { id } = req.params

  await cancelBeginOrderExchangeWorkflow(req.scope).run({
    input: {
      exchange_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "exchange",
    deleted: true,
  })
}
