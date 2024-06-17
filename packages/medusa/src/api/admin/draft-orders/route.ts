import { createOrdersWorkflow } from "@medusajs/core-flows"
import {
  ContainerRegistrationKeys,
  OrderStatus,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { AdminCreateDraftOrderType } from "./validators"
import { refetchOrder } from "./helpers"
import { CreateOrderDTO } from "@medusajs/types"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "order",
    variables: {
      filters: {
        ...req.filterableFields,
        is_draft_order: true,
      },
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: draft_orders, metadata } = await remoteQuery(queryObject)

  res.json({
    draft_orders,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateDraftOrderType>,
  res: MedusaResponse
) => {
  const input = req.validatedBody
  const workflowInput = {
    ...input,
    no_notification: !!input.no_notification_order,
    status: OrderStatus.DRAFT,
    is_draft_order: true,
  } as CreateOrderDTO

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  if (!input.currency_code) {
    const queryObject = remoteQueryObjectFromString({
      entryPoint: "region",
      variables: {
        filters: { id: input.region_id },
      },
      fields: ["currency_code"],
    })
    const [region] = await remoteQuery(queryObject)
    input.currency_code = region?.currency_code
  }

  if (!input.email) {
    const queryObject = remoteQueryObjectFromString({
      entryPoint: "customer",
      variables: {
        filters: { id: input.customer_id },
      },
      fields: ["email"],
    })
    const [customer] = await remoteQuery(queryObject)
    input.email = customer?.email
  }

  const { result } = await createOrdersWorkflow(req.scope).run({
    input: workflowInput,
  })

  const draftOrder = await refetchOrder(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ draft_order: draftOrder })
}
