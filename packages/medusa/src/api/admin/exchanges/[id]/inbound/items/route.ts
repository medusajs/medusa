import { orderExchangeRequestItemReturnWorkflow } from "@zjedene-medusa/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import { defaultAdminDetailsReturnFields } from "../../../../returns/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminAddExchangeInboundItems,
    HttpTypes.SelectParams
  >,
  res: MedusaResponse<HttpTypes.AdminExchangeReturnResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [exchange] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_exchange",
      variables: {
        id,
      },
      fields: ["id", "return_id"],
    }),
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result } = await orderExchangeRequestItemReturnWorkflow(
    req.scope
  ).run({
    input: {
      ...req.validatedBody,
      return_id: exchange.return_id,
      exchange_id: id,
    },
  })

  const returnId = result.order_change.return_id
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: returnId,
    },
    fields: defaultAdminDetailsReturnFields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
