import { beginClaimOrderWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { AdminPostOrderClaimsReqSchemaType } from "./validators"

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
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
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
  req: AuthenticatedMedusaRequest<AdminPostOrderClaimsReqSchemaType>,
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
    fields: req.remoteQueryConfig.fields,
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
