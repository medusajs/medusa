import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@zjedene-medusa/framework/http"

import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/framework/utils"
import { createProductTypesWorkflow } from "@zjedene-medusa/core-flows"
import { refetchProductType } from "./helpers"
import { HttpTypes } from "@zjedene-medusa/framework/types"

export const GET = async (
  req: AuthenticatedMedusaRequest<HttpTypes.AdminProductTypeListParams>,
  res: MedusaResponse<HttpTypes.AdminProductTypeListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_type",
    variables: {
      filters: req.filterableFields,
      ...req.queryConfig.pagination,
    },
    fields: req.queryConfig.fields,
  })

  const { rows: product_types, metadata } = await remoteQuery(queryObject)

  res.json({
    product_types: product_types,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<
    HttpTypes.AdminCreateProductType,
    HttpTypes.AdminProductTypeParams
  >,
  res: MedusaResponse<HttpTypes.AdminProductTypeResponse>
) => {
  const input = [req.validatedBody]

  const { result } = await createProductTypesWorkflow(req.scope).run({
    input: { product_types: input },
  })

  const productType = await refetchProductType(
    result[0].id,
    req.scope,
    req.queryConfig.fields
  )

  res.status(200).json({ product_type: productType })
}
