import { orderClaimRequestItemReturnWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { defaultAdminDetailsReturnFields } from "../../../../returns/query-config"
import { AdminPostReturnsRequestItemsReqSchemaType } from "../../../../returns/validators"
import { HttpTypes } from "@medusajs/types"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsRequestItemsReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminClaimReturnPreviewResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [claim] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_claim",
      variables: {
        id,
      },
      fields: ["return_id"],
    }),
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result } = await orderClaimRequestItemReturnWorkflow(req.scope).run({
    input: {
      ...req.validatedBody,
      return_id: claim.return_id,
      claim_id: id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: claim.return_id,
    },
    fields: defaultAdminDetailsReturnFields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: result,
    return: orderReturn,
  })
}
