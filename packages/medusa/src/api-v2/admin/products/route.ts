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
import { refetchProduct, remapKeysForProduct, remapProduct } from "./helpers"
import { AdminGetProductsParams } from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetProductsParams>,
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
    products: products.map(remapProduct),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductDTO>,
  res: MedusaResponse
) => {
  const input = [req.validatedBody]

  const { result, errors } = await createProductsWorkflow(req.scope).run({
    input: { products: input },
    throwOnError: false,
  })

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const product = await refetchProduct(
    result[0].id,
    req.scope,
    req.remoteQueryConfig.fields
  )
  res.status(200).json({ product: remapProduct(product) })
}
