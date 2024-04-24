import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../types/routing"
import { wrapProductsWithPrices, wrapWithCategoryFilters } from "./helpers"
import { StoreGetProductsParamsType } from "./validators"

export const GET = async (
  req: MedusaRequest<StoreGetProductsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: wrapWithCategoryFilters(req.filterableFields),
      ...req.remoteQueryConfig.pagination,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows, metadata } = await remoteQuery(queryObject)
  const products = await wrapProductsWithPrices(
    rows,
    req.scope,
    req.pricingContext!
  )

  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
