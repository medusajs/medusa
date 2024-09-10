import { createShippingOptionsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchShippingOption } from "./helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminShippingOptionListParams>,
  res: MedusaResponse<HttpTypes.AdminShippingOptionListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: shipping_options, metadata } = await query.graph({
    entryPoint: "shipping_options",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  res.json({
    shipping_options,
    count: metadata?.count,
    offset: metadata?.skip,
    limit: metadata?.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminCreateShippingOption>,
  res: MedusaResponse<HttpTypes.AdminShippingOptionResponse>
) => {
  const shippingOptionPayload = req.validatedBody

  const workflow = createShippingOptionsWorkflow(req.scope)

  const { result } = await workflow.run({
    input: [shippingOptionPayload],
  })

  const shippingOption = await refetchShippingOption(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({ shipping_option: shippingOption })
}
