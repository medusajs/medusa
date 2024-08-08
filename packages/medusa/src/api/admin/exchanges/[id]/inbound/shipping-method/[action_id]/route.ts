import {
  removeReturnShippingMethodWorkflow,
  updateReturnShippingMethodWorkflow,
} from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../../../types/routing"
import { defaultAdminDetailsReturnFields } from "../../../../../returns/query-config"
import { AdminPostExchangesShippingActionReqSchemaType } from "../../../../validators"

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminPostExchangesShippingActionReqSchemaType>,
  res: MedusaResponse
) => {
  const { id, action_id } = req.params

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const [exchange] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_exchange",
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

  const { result } = await updateReturnShippingMethodWorkflow(req.scope).run({
    input: {
      data: { ...req.validatedBody },
      return_id: exchange.return_id,
      action_id,
    },
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

  const [orderExchange] = await remoteQuery(queryObject)

  res.json({
    order_preview: result,
    exchange: orderExchange,
  })
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const { id, action_id } = req.params

  const [exchange] = await remoteQuery(
    remoteQueryObjectFromString({
      entryPoint: "order_exchange",
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

  const { result: orderPreview } = await removeReturnShippingMethodWorkflow(
    req.scope
  ).run({
    input: {
      return_id: exchange.return_id,
      action_id,
    },
  })

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "return",
    variables: {
      id: exchange.return_id,
    },
    fields: defaultAdminDetailsReturnFields,
  })

  const [orderReturn] = await remoteQuery(queryObject)

  res.json({
    order_preview: orderPreview,
    return: orderReturn,
  })
}
