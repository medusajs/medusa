import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { AuthenticatedMedusaRequest } from "../../../../types/routing"
import { refetchEntities, refetchEntity } from "../../refetch-entity"

export function normalizeDataForContext() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    // If the product pricing is not requested, we don't need region information
    let withCalculatedPrice = req.remoteQueryConfig.fields.some((field) =>
      field.startsWith("variants.calculated_price")
    )

    // If the region is passed, we calculate the prices without requesting them.
    // TODO: This seems a bit messy, reconsider if we want to keep this logic.
    if (!withCalculatedPrice && req.filterableFields.region_id) {
      req.remoteQueryConfig.fields.push("variants.calculated_price.*")
      withCalculatedPrice = true
    }

    if (!withCalculatedPrice) {
      return next()
    }

    // Region ID is required to calculate prices correctly.
    // Country code, and optionally province, are needed to calculate taxes.
    let regionId = req.filterableFields.region_id
    let countryCode = req.filterableFields.country_code
    let province = req.filterableFields.province

    // If the cart is passed, get the information from it
    if (req.filterableFields.cart_id) {
      const cart = await refetchEntity(
        "cart",
        req.filterableFields.cart_id,
        req.scope,
        ["region_id", "shipping_address.*"]
      )

      if (cart?.region_id) {
        regionId = cart.region_id
      }

      if (cart?.shipping_address) {
        countryCode = cart.shipping_address.country_code
        province = cart.shipping_address.province
      }
    }

    // Finally, try to get it from the store defaults if not available
    if (!regionId) {
      const stores = await refetchEntities("store", {}, req.scope, [
        "default_region_id",
      ])
      regionId = stores[0]?.default_region_id
    }

    if (!regionId) {
      try {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Missing required pricing context to calculate prices - region_id`
        )
      } catch (e) {
        return next(e)
      }
    }

    req.filterableFields.region_id = regionId
    req.filterableFields.country_code = countryCode
    req.filterableFields.province = province

    return next()
  }
}
