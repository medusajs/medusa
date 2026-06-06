import { beginExchangeOrderWorkflow } from "@zjedene-medusa/core-flows"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminExchangeListParams>,
  res: MedusaResponse<HttpTypes.AdminExchangeListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchanges",
    variables: {
      filters: {
        ...req.filterableFields,
      },
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: exchanges, metadata } = await remoteQuery(queryObject)

  res.json({
    exchanges,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateExchange,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminExchangeOrderResponse>
) => {
  const input = {
    ...req.validatedBody,
    created_by: req.auth_context.actor_id,
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const orderModuleService = req.scope.resolve(Modules.ORDER)

  const workflow = beginExchangeOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchange",
    variables: {
      id: result.exchange_id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.queryConfig.fields,
  })

  const [order, orderExchange] = await promiseAll([
    orderModuleService.retrieveOrder(result.order_id),
    remoteQuery(queryObject),
  ])

  res.json({
    order,
    exchange: orderExchange[0],
  })
}
