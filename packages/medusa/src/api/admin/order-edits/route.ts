import { beginOrderEditOrderWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminPostOrderEditsReqSchemaType } from "./validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostOrderEditsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const input = req.validatedBody as AdminPostOrderEditsReqSchemaType
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const workflow = beginOrderEditOrderWorkflow(req.scope)
  const { result } = await workflow.run({
    input,
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      id: result.order_id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [order] = await remoteQuery(queryObject)

  res.json({
    order,
  })
}
