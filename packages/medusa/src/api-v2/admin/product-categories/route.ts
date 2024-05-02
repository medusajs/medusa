import { createProductCategoryWorkflow } from "@medusajs/core-flows"
import {
  AdminProductCategoryListResponse,
  AdminProductCategoryResponse,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../types/routing"
import { refetchCategory } from "./helpers"
import {
  AdminCreateProductCategoryType,
  AdminProductCategoriesParamsType,
} from "./validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminProductCategoriesParamsType>,
  res: MedusaResponse<AdminProductCategoryListResponse>
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product_category",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: product_categories, metadata } = await remoteQuery(queryObject)

  res.json({
    product_categories,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest<AdminCreateProductCategoryType>,
  res: MedusaResponse<AdminProductCategoryResponse>
) => {
  const { result, errors } = await createProductCategoryWorkflow(req.scope).run(
    {
      input: { product_category: req.validatedBody },
      throwOnError: false,
    }
  )

  if (Array.isArray(errors) && errors[0]) {
    throw errors[0].error
  }

  const category = await refetchCategory(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields,
    req.filterableFields
  )

  res.status(200).json({ product_category: category })
}
