import { MedusaPricingContext } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { AuthenticatedMedusaRequest } from "../../../../types/routing"
import { refetchEntities, refetchEntity } from "../../refetch-entity"

export function setPricingContext() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const withCalculatedPrice = req.remoteQueryConfig.fields.some((field) =>
      field.startsWith("variants.calculated_price")
    )
    if (!withCalculatedPrice) {
      return next()
    }

    // We validate the region ID in the previous middleware
    const region = await refetchEntity(
      "region",
      req.filterableFields.region_id!,
      req.scope,
      ["id", "currency_code"]
    )

    if (!region) {
      try {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Region with id ${req.filterableFields.region_id} not found when populating the pricing context`
        )
      } catch (e) {
        return next(e)
      }
    }

    const pricingContext: MedusaPricingContext = {
      region_id: region.id,
      currency_code: region.currency_code,
    }

    // Find all the customer groups the customer is a part of and set
    if (req.user?.customer_id) {
      const customerGroups = await refetchEntities(
        "customer_group",
        { customer_id: req.user?.customer_id },
        req.scope,
        ["id"]
      )

      pricingContext.customer_group_id = customerGroups.map((cg) => cg.id)
    }

    req.pricingContext = pricingContext
    return next()
  }
}
