import { isPresent, MedusaError } from "@medusajs/framework/utils"
import { MedusaResponse } from "@medusajs/framework/http"
import { wrapVariantsWithInventoryQuantity } from "../../../utils/middlewares"
import {
  refetchProduct,
  RequestWithContext,
  wrapProductsWithTaxPrices,
} from "../helpers"
import { StoreGetProductParamsType } from "../validators"
import { HttpTypes } from "@medusajs/framework/types"

export const GET = async (
  req: RequestWithContext<StoreGetProductParamsType>,
  res: MedusaResponse<HttpTypes.StoreProductResponse>
) => {
  const withInventoryQuantity = req.remoteQueryConfig.fields.some((field) =>
    field.includes("variants.inventory_quantity")
  )

  if (withInventoryQuantity) {
    req.remoteQueryConfig.fields = req.remoteQueryConfig.fields.filter(
      (field) => !field.includes("variants.inventory_quantity")
    )
  }

  const filters: object = {
    id: req.params.id,
    ...req.filterableFields,
  }

  if (isPresent(req.pricingContext)) {
    filters["context"] = {
      "variants.calculated_price": { context: req.pricingContext },
    }
  }

  const product = await refetchProduct(
    filters,
    req.scope,
    req.remoteQueryConfig.fields
  )

  if (!product) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Product with id: ${req.params.id} was not found`
    )
  }

  if (withInventoryQuantity) {
    await wrapVariantsWithInventoryQuantity(req, product.variants || [])
  }

  await wrapProductsWithTaxPrices(req, [product])
  res.json({ product })
}
