import {
  ContainerRegistrationKeys,
  isPresent,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { MedusaResponse } from "../../../types/routing"
import { wrapVariantsWithInventoryQuantity } from "../../utils/middlewares"
import { StoreGetProductsParamsType } from "./validators"
import { RequestWithContext, wrapProductsWithTaxPrices } from "./helpers"

export const GET = async (
  req: RequestWithContext<StoreGetProductsParamsType>,
  res: MedusaResponse
) => {
  const remoteQuery = req.scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const context: object = {}
  const withInventoryQuantity = req.remoteQueryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.remoteQueryConfig.fields = req.remoteQueryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  if (isPresent(req.pricingContext)) {
    context["variants.calculated_price"] = {
      context: req.pricingContext,
    }
  }

  const queryObject = remoteQueryObjectFromString({
    entryPoint: "product",
    variables: {
      filters: req.filterableFields,
      ...req.remoteQueryConfig.pagination,
      ...context,
    },
    fields: req.remoteQueryConfig.fields,
  })

  const { rows: products, metadata } = await remoteQuery(queryObject)

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantity(
      req,
      products.map((product) => product.variants).flat(1)
    )
  }

  await wrapProductsWithTaxPrices(req, products)
  res.json({
    products,
    count: metadata.count,
    offset: metadata.skip,
    limit: metadata.take,
  })
}
