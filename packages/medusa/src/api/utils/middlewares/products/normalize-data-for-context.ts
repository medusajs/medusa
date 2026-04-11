import { MedusaError } from "@medusajs/framework/utils"
import { NextFunction } from "express"
import {
  AuthenticatedMedusaRequest,
  refetchEntities,
  refetchEntity,
} from "@medusajs/framework/http"
import { DEFAULT_PRICE_FIELD_PATHS } from "./constants"

type PricingContextOptions = {
  priceFieldPaths?: string[]
}

export function normalizeDataForContext(options: PricingContextOptions = {}) {
  const { priceFieldPaths = DEFAULT_PRICE_FIELD_PATHS } = options

  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    // If the product pricing is not requested, we don't need region information
    let withCalculatedPrice = false

    req.queryConfig.fields = req.queryConfig.fields.map((field) => {
      for (const pricePath of priceFieldPaths) {
        if (field === pricePath) {
          withCalculatedPrice = true
          return `${pricePath}.*`
        }

        if (field.startsWith(`${pricePath}.`)) {
          withCalculatedPrice = true
          return field
        }
      }

      return field
    })

    // If the region is passed, we calculate the prices without requesting them.
    // TODO: This seems a bit messy, reconsider if we want to keep this logic.
    if (!withCalculatedPrice && req.filterableFields.region_id) {
      for (const pricePath of priceFieldPaths) {
        const wildcardField = `${pricePath}.*`
        if (!req.queryConfig.fields.includes(wildcardField)) {
          req.queryConfig.fields.push(wildcardField)
        }
      }
      withCalculatedPrice = priceFieldPaths.length > 0
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
      const cart = await refetchEntity({
        entity: "cart",
        idOrFilter: req.filterableFields.cart_id,
        scope: req.scope,
        fields: ["region_id", "shipping_address.*"],
      })

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
      const { data: stores } = await refetchEntities({
        entity: "store",
        scope: req.scope,
        fields: ["id", "default_region_id"],
        options: {
          cache: {
            enable: true,
          },
        },
      })
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
