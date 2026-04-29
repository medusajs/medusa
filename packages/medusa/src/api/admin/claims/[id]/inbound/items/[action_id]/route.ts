import {
  removeItemReturnActionWorkflow,
  updateRequestItemReturnWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
  refetchEntity,
} from "@medusajs/framework/http"
import { HttpTypes } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { defaultAdminDetailsReturnFields } from "../../../../../returns/query-config"
import { AdminPostReturnsRequestItemsActionReqSchemaType } from "../../../../../returns/validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostReturnsRequestItemsActionReqSchemaType>,
  res: MedusaResponse<HttpTypes.AdminClaimReturnPreviewResponse>
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [claim] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_claim",
      variables: {
        id,
      },
      fields: ["id", "return_id"],
    }),
    {
      throwIfKeyNotFound: true,
    }
  )

  const { result } = await updateRequestItemReturnWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      return_id: claim.return_id,
      claim_id: claim.id,
      action_id,
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
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminClaimReturnPreviewResponse>
) => {
  const { id, action_id } = req.params

  const claim = await refetchEntity({
    entity: "order_claim",
    idOrFilter: id,
    scope: req.scope,
    fields: ["id", "return_id"],
  })

  const { result: orderPreview } = await removeItemReturnActionWorkflow(
    req.scope
  ).run({
    input: {
      return_id: claim.return_id,
      action_id,
    },
  })

  const orderReturn = await refetchEntity({
    entity: "return",
    idOrFilter: {
      ...req.filterableFields,
      id,
    },
    scope: req.scope,
    fields: defaultAdminDetailsReturnFields,
  })

  res.json({
    order_preview: orderPreview as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
