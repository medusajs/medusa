import { beginClaimOrderWorkflow } from "@zjedene-medusa/core-flows"
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
  req: AuthenticatedMedusaRequest<HttpTypes.AdminClaimListParams>,
  res: MedusaResponse<HttpTypes.AdminClaimListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_claims",
    variables: {
      filters: {
        ...req.filterableFields,
      },
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: claims, metadata } = await remoteQuery(queryObject)

  res.json({
    claims,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateClaim,
    HttpTypes.AdminClaimParams
  >,
  res: MedusaResponse<HttpTypes.AdminClaimOrderResponse>
) => {
  const input = {
    ...req.validatedBody,
    created_by: req.auth_context.actor_id,
  }

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const orderModuleService = req.scope.resolve(Modules.ORDER)

  const workflow = beginClaimOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_claim",
    variables: {
      id: result.claim_id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.queryConfig.fields,
  })

  const [order, orderClaim] = await promiseAll([
    orderModuleService.retrieveOrder(result.order_id),
    remoteQuery(queryObject),
  ])

  res.json({
    order,
    claim: orderClaim[0],
  })
}
