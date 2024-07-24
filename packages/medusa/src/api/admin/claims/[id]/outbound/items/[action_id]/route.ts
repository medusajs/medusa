import {
  removeItemClaimActionWorkflow,
  updateClaimAddItemWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { AdminPostClaimsItemsActionReqSchemaType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostClaimsItemsActionReqSchemaType>,
  res: MedusaResponse
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await updateClaimAddItemWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      claim_id: id,
      action_id,
    },
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

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

  const { result: orderPreview } = await removeItemClaimActionWorkflow(
    req.scope
  ).run({
    input: {
      claim_id: id,
      action_id,
    },
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
    order_preview: orderPreview,
    claim: orderClaim,
  })
}
