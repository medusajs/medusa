import {
  createOrderWorkflow,
  getOrdersListWorkflow,
} from "@medusajs/core-flows"
import {
  AuthenticatedMedusaRequest,
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import {
  AdditionalData,
  CreateOrderDTO,
  HttpTypes,
  OrderDTO,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  OrderStatus,
  remoteQueryObjectFromString,
} from "@medusajs/framework/utils"
import { refetchOrder } from "./helpers"

export const GET = async (
  req: MedusaRequest<HttpTypes.AdminDraftOrderListParams>,
  res: MedusaResponse<HttpTypes.AdminDraftOrderListResponse>
) => {
  const variables = {
    filters: {
      ...req.filterableFields,
      is_draft_order: true,
    },
    ...req.queryConfig.pagination,
  }

  const workflow = getOrdersListWorkflow(req.scope)
  const { result } = await workflow.run({
    input: {
      fields: req.queryConfig.fields,
      variables,
    },
  })

  const { rows, metadata } = result as {
    rows: OrderDTO[]
    metadata: any
  }
  res.json({
    draft_orders: rows as unknown as HttpTypes.AdminOrder[],
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateDraftOrder & AdditionalData,
    HttpTypes.AdminDraftOrderParams
  >,
  res: MedusaResponse<HttpTypes.AdminDraftOrderResponse>
) => {
  const input = req.validatedBody
  const workflowInput = {
    ...input,
    no_notification: !!input.no_notification_order,
    status: OrderStatus.DRAFT,
    is_draft_order: true,
  } as CreateOrderDTO & AdditionalData

  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  /**
   * If the currency code is not provided, we fetch the region and use the currency code from there.
   */
  if (!workflowInput.currency_code) {
    const queryObject = remoteQueryObjectFromString({
      entryPoint: "region",
      variables: {
        filters: { id: input.region_id },
      },
      fields: ["currency_code"],
    })
    const [region] = await remoteQuery(queryObject)
    workflowInput.currency_code = region?.currency_code
  }

  /**
   * If the email is not provided, we fetch the customer and use the email from there.
   */
  if (!workflowInput.email) {
    const queryObject = remoteQueryObjectFromString({
      entryPoint: "customer",
      variables: {
        filters: { id: input.customer_id },
      },
      fields: ["email"],
    })
    const [customer] = await remoteQuery(queryObject)
    workflowInput.email = customer?.email
  }

  /**
   * We accept either a ID or a payload for both billing and shipping addresses.
   * If either field was received as a string, we assume it's an ID and
   * then ensure that it is passed along correctly to the workflow.
   */
  if (typeof input.billing_address === "string") {
    workflowInput.billing_address_id = input.billing_address
    delete workflowInput.billing_address
  }

  if (typeof input.shipping_address === "string") {
    workflowInput.shipping_address_id = input.shipping_address
    delete workflowInput.shipping_address
  }

  const { result } = await createOrderWorkflow(req.scope).run({
    input: workflowInput,
  })

  const draftOrder = await refetchOrder(
    result.id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ draft_order: draftOrder })
}
