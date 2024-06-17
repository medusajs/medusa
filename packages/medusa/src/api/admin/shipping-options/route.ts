import { createShippingOptionsWorkflow } from "@medusajs/core-flows"
import { HttpTypes } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchShippingOption } from "./helpers"
import {
  AdminCreateShippingOptionType,
  AdminGetShippingOptionsParamsType,
} from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetShippingOptionsParamsType>,
  res: MedusaResponse<HttpTypes.AdminShippingOptionListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_options",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: shipping_options, metadata } = await remoteQuery(queryObject)

  res.json({
    shipping_options,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateShippingOptionType>,
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
