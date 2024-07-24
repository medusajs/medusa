import { createClaimShippingMethodWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../types/routing"
import { AdminPostClaimsShippingReqSchemaType } from "../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostClaimsShippingReqSchemaType>,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await createClaimShippingMethodWorkflow(req.scope).run({
    input: { ...req.validatedBody, claim_id: id },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "claim",
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
    claim: orderClaim,
  })
}
