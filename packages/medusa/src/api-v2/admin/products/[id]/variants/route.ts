import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../../types/routing"

import { CreateProductVariantDTO } from "@medusajs/types"
import { createProductVariantsWorkflow } from "@medusajs/core-flows"
import { remoteQueryObjectFromString } from "@medusajs/utils"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve("remoteQuery")
  const productId = req.params.id

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_variant",
    variables: {
      filters: { ...req.filterableFields, product_id: productId },
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    },
    fields: req.listConfig.select as string[],
  })

  const { rows: product_variants, metadata } = await remoteQuery(queryObject)

  res.json({
    product_variants,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<CreateProductVariantDTO>,
  res: MedusaResponse
) => {
  const input = [
    {
      ...req.validatedBody,
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

  res.status(200).json({ product_variant: result[0] })
}
