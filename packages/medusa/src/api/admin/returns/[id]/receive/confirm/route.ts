import { confirmReturnReceiveWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminPostReturnsConfirmRequestReqSchemaType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsConfirmRequestReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminReturnPreviewResponse>
) => {
  const { id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { result } = await confirmReturnReceiveWorkflow(req.scope).run({
    input: {
      return_id: id,
      confirmed_by: req.auth_context.actor_id,
    },
  })

  const {
    data: [orderReturn],
  } = await query.graph({
    entryPoint: "return",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
