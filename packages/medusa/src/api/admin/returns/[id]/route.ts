import { updateReturnWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminPostReturnsReturnReqSchemaType } from "../validators"
import { HttpTypes } from "@medusajs/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<HttpTypes.AdminReturnResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  const {
    data: [orderReturn],
  } = await query.graph(
    {
      entryPoint: "return",
      variables: {
        id,
        filters: {
          ...req.filterableFields,
        },
      },
      fields: req.remoteQueryConfig.fields,
    },
    {
      throwIfKeyNotFound: true,
    }
  )

  res.json({
    return: orderReturn,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsReturnReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminReturnPreviewResponse>
) => {
  const { id } = req.params

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { result } = await updateReturnWorkflow(req.scope).run({
    input: { return_id: id, ...req.validatedBody },
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
