import { createProductsWorkflow } from "@medusajs/core-flows"
import { CreateProductDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import {
  refetchProduct,
  remapKeysForProduct,
  remapProductResponse,
} from "./helpers"
import {
  AdminCreateProductType,
  AdminGetProductsParamsType,
} from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const selectFields = remapKeysForProduct(req.remoteQueryConfig.fields ?? [])

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: selectFields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  res.json({
    products: products.map(remapProductResponse),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateProductType>,
  res: MedusaResponse
) => {
  const input = [req.validatedBody as CreateProductDTO]

  const { result } = await createProductsWorkflow(req.scope).run({
    input: { products: input },
  })

  const product = await refetchProduct(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ product: remapProductResponse(product) })
}
