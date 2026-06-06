import { createOrderCreditLinesWorkflow } from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { ContainerRegistrationKeys } from "@zjedene-medusa/framework/utils"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateOrderCreditLine,
    HttpTypes.AdminGetOrderParams
  >,
  res: MedusaResponse<HttpTypes.AdminOrderResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { id } = req.params

  await createOrderCreditLinesWorkflow(req.scope).run({
    input: { credit_lines: [req.validatedBody], id },
  })

  const {
    data: [order],
  } = await query.graph(
    {
      entity: "orders",
      fields: req.queryConfig.fields,
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  )

  res.status(200).json({ order })
}
