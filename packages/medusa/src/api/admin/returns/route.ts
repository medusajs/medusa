import { beginReturnOrderWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  promiseAll,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminPostReturnsReqSchemaType } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminOrderFilters>,
  res: MedusaResponse<HttpTypes.AdminReturnsResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: returns, metadata } = await query.graph({
    entryPoint: "returns",
    variables: {
      filters: {
        ...req.filterableFields,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    returns,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderReturnResponse>
) => {
  const input = {
    ...req.validatedBody,
    created_by: req.auth_context.actor_id,
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const orderModuleService = req.scope.resolve(ModuleRegistrationName.ORDER)

  const workflow = beginReturnOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  const [
    order,
    {
      data: [orderReturn],
    },
  ] = await promiseAll([
    orderModuleService.retrieveOrder(result.order_id),
    query.graph({
      entryPoint: "return",
      variables: {
        id: result.return_id,
        filters: {
          ...req.filterableFields,
        },
      },
      fields: req.remoteQueryConfig.fields,
    }),
  ])

  res.json({
    order,
    return: orderReturn[0],
  })
}
