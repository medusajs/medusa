import {
  ContainerRegistrationKeys,
  isPresent,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { wrapWithCategoryFilters } from "./helpers"
import { StoreGetProductsParamsType } from "./validators"

export const GET = async (
  req: MedusaRequest<StoreGetProductsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const context = isPresent(req.pricingContext)
    ? {
        "variants.calculated_price": { context: req.pricingContext },
      }
    : undefined

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: wrapWithCategoryFilters(req.filterableFields),
      ...context,
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
