import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"

import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { createShippingOptionTypesWorkflow } from "@medusajs/core-flows"
import { refetchShippingOptionType } from "./helpers"
import { HttpTypes } from "@medusajs/framework/types"

/**
 * @since 2.10.0
 */
export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminShippingOptionTypeListParams>,
  res: MedusaResponse<HttpTypes.AdminShippingOptionTypeListResponse>
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: shippingOptionTypes, metadata } = await query.graph({
    entity: "shipping_option_type",
    fields: req.queryConfig.fields,
    filters: req.filterableFields,
    pagination: req.queryConfig.pagination,
  })

  res.json({
    shipping_option_types: shippingOptionTypes,
    count: metadata!.count,
    offset: metadata!.skip,
    limit: metadata!.take,
  })
}

/**
 * @since 2.10.0
 */
export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateShippingOptionType,
    HttpTypes.AdminGetShippingOptionTypeParams
  >,
  res: MedusaResponse<HttpTypes.AdminShippingOptionTypeResponse>
) => {
  const input = [req.validatedBody]

  const { result } = await createShippingOptionTypesWorkflow(req.scope).run({
    input: { shipping_option_types: input },
  })

  const shippingOptionType = await refetchShippingOptionType(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ shipping_option_type: shippingOptionType })
}
