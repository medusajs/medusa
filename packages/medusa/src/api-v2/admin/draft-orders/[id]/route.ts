import { Order } from "@medusajs/core-flows"
import { UpdateOrderDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../types/routing"
import { defaultAdminOrderFields } from "../query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const variables = { id: req.params.id }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables,
    fields: defaultAdminOrderFields,
  })

  const [order] = await remoteQuery(queryObject)
  res.status(200).json({ order })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result, errors } = await Order.updateOrdersWorkflow(req.scope).run({
    input: {
      selector: { id: req.params.id },
      update: req.validatedBody as UpdateOrderDTO,
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ order: result[0] })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result, errors } = await Order.deleteOrdersWorkflow(req.scope).run({
    input: {
      ids: Array.isArray(req.params.id) ? req.params.id : [req.params.id],
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ order: result[0] })
}
