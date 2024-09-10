import {
  beginReceiveReturnWorkflow,
  cancelReturnReceiveWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  promiseAll,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { AdminPostReceiveReturnsReqSchemaType } from "../../validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReceiveReturnsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderReturnResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const orderModuleService = req.scope.resolve(ModuleRegistrationName.ORDER)

  const { id } = req.params

  const workflow = beginReceiveReturnWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      ...req.validatedBody,
      return_id: id,
    },
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

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminReturnDeleteResponse>
) => {
  const { id } = req.params

  await cancelReturnReceiveWorkflow(req.scope).run({
    input: {
      return_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "return",
    deleted: true,
  })
}
