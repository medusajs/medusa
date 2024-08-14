import { confirmOrderEditRequestWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminOrderEditRequestResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await confirmOrderEditRequestWorkflow(req.scope).run({
    input: { order_id: id },
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

  const [order] = await remoteQuery(queryObject, undefined, {
    throwIfKeyNotFound: true,
  })

  res.json({
    order_preview: result,
    order,
  })
}
