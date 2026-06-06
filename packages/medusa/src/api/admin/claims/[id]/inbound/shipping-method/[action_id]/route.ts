import {
  removeClaimShippingMethodWorkflow,
  updateReturnShippingMethodWorkflow,
} from "@zjedene-medusa/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"
import { HttpTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import { defaultAdminDetailsReturnFields } from "../../../../../returns/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminClaimUpdateInboundShipping,
    HttpTypes.AdminClaimActionsParams
  >,
  res: MedusaResponse<HttpTypes.AdminClaimPreviewResponse>
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

  const { result } = await updateReturnShippingMethodWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      return_id: claim.return_id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_claim",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.queryConfig.fields,
  })

  const [orderClaim] = await remoteQuery(queryObject)

  res.json({
    order_preview: result as unknown as HttpTypes.AdminOrderPreview,
    claim: orderClaim,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest<{}, HttpTypes.SelectParams>,
  res: MedusaResponse<HttpTypes.AdminClaimReturnPreviewResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

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

  const { result: orderPreview } = await removeClaimShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
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
    order_preview: orderPreview as unknown as HttpTypes.AdminOrderPreview,
    return: orderReturn,
  })
}
