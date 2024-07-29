import { confirmClaimRequestWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"
import { defaultAdminDetailsReturnFields } from "../../../returns/query-config"

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await confirmClaimRequestWorkflow(req.scope).run({
    input: { claim_id: id },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_claim",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderClaim] = await remoteQuery(queryObject, undefined, {
    throwIfKeyNotFound: true,
  })

  let orderReturn
  if (orderClaim.return_id) {
    const [orderReturnData] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "return",
        variables: {
          id: orderClaim.return_id,
        },
        fields: defaultAdminDetailsReturnFields,
      })
    )
    orderReturn = orderReturnData
  }

  res.json({
    order_preview: result,
    claim: orderClaim,
    return: orderReturn,
  })
}
