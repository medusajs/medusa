import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { CreateProductVariantDTO } from "@medusajs/types"
import { createProductVariantsWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  remapKeysForProduct,
  remapKeysForVariant,
  remapProduct,
  remapVariant,
} from "../../helpers"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const productId = req.params.id

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "variant",
    variables: {
      filters: { ...req.filterableFields, product_id: productId },
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: remapKeysForVariant(req.remoteQueryConfig.fields ?? []),
  })

  const { rows: variants, metadata } = await remoteQuery(queryObject)

  res.json({
    variants: variants.map(remapVariant),
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductVariantDTO>,
  res: MedusaResponse
) => {
  const productId = req.params.id
  const input = [
    {
      ...req.validatedBody,
      product_id: productId,
    },
  ]

  const { result, errors } = await createProductVariantsWorkflow(req.scope).run(
    {
      input: { product_variants: input },
      throwOnError: false,
    }
  )

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const remoteQuery = req.scope.resolve("remoteQuery")
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: { id: productId },
    },
    fields: remapKeysForProduct(req.remoteQueryConfig.fields ?? []),
  })

  const products = await remoteQuery(queryObject)
  res.status(200).json({ product: remapProduct(products[0]) })
}
