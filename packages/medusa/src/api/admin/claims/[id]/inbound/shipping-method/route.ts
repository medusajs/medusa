import { createClaimShippingMethodWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminPostReturnsShippingReqSchemaType } from "../../../../returns/validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsShippingReqSchemaType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [claim] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "claim",
      variables: {
        id,
      },
      fields: ["return_id"],
    }),
    undefined,
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result } = await createClaimShippingMethodWorkflow(req.scope).run({
    input: { ...req.validatedBody, return_id: claim.return_id, claim_id: id },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderClaim] = await remoteQuery(queryObject)

  res.json({
    order_preview: result,
    return: orderClaim,
  })
}
