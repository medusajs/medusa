import { createOrdersWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  OrderStatus,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { defaultAdminOrderFields } from "./query-config"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        ...req.filterableFields,
        status: OrderStatus.DRAFT,
      },
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: defaultAdminOrderFields,
  })

  const { rows: stores, metadata } = await remoteQuery(queryObject)

  res.json({
    stores,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { result, errors } = await createOrdersWorkflow(req.scope).run({
    input: {
      orders: {
        ...(req.validatedBody as any) /* as CreateDraftOrderDTO */,
        status: OrderStatus.DRAFT,
      },
    },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  res.status(200).json({ store: result[0] })
}
