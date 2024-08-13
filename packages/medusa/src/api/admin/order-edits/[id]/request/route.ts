import {
  cancelBeginOrderOrderEditWorkflow,
  confirmOrderEditRequestWorkflow,
} from "@medusajs/core-flows"
import { DeleteResponse, HttpTypes } from "@medusajs/types"
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
  res: MedusaResponse<HttpTypes.AdminOrderEditRequestResponse>
) => {
  const { id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { result } = await confirmOrderEditRequestWorkflow(req.scope).run({
    input: { exchange_id: id },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order_exchange",
    variables: {
      id,
      filters: {
        ...req.filterableFields,
      },
    },
    fields: req.remoteQueryConfig.fields,
  })

  const [orderOrderEdit] = await remoteQuery(queryObject, undefined, {
    throwIfKeyNotFound: true,
  })

  let orderReturn
  if (orderOrderEdit.return_id) {
    const [orderReturnData] = await remoteQuery(
      remoteQueryObjectFromString({
        entryPoint: "return",
        variables: {
          id: orderOrderEdit.return_id,
        },
        fields: defaultAdminDetailsReturnFields,
      })
    )
    orderReturn = orderReturnData
  }

  res.json({
    order_preview: result,
    exchange: orderOrderEdit,
    return: orderReturn,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse<DeleteResponse<"exchange">>
) => {
  const { id } = req.params

  await cancelBeginOrderOrderEditWorkflow(req.scope).run({
    input: {
      exchange_id: id,
    },
  })

  res.status(200).json({
    id,
    object: "exchange",
    deleted: true,
  })
}
