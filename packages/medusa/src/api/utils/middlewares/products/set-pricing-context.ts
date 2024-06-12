import { MedusaPricingContext } from "@medusajs/types"
import { isPresent, MedusaError } from "@medusajs/utils"
import { NextFunction } from "express"
import { AuthenticatedMedusaRequest } from "../../../../types/routing"
import { refetchEntities, refetchEntity } from "../../refetch-entity"

export function setPricingContext() {
  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const withCalculatedPrice = req.remoteQueryConfig.fields.some((field) =>
      field.startsWith("variants.calculated_price")
    )

    // If the endpoint doesn't pass region_id and currency_code, we can exit early
    if (
      !withCalculatedPrice &&
      !req.filterableFields.region_id &&
      !req.filterableFields.currency_code
    ) {
      return next()
    }

    // If the endpoint requested the field variants.calculated_price, we should throw
    // an error if region or currency is not passed
    if (
      withCalculatedPrice &&
      !req.filterableFields.region_id &&
      !req.filterableFields.currency_code
    ) {
      try {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Missing required pricing context to calculate prices - currency_code or region_id`
        )
      } catch (e) {
        return next(e)
      }
    }

    const query = req.filterableFields || {}
    const pricingContext: MedusaPricingContext = {}
    const customerId = req.user?.customer_id

    if (query.region_id) {
      const region = await refetchEntity("region", query.region_id, req.scope, [
        "id",
        "currency_code",
      ])

      if (region) {
        pricingContext.region_id = region.id
      }

      if (region?.currency_code) {
        pricingContext.currency_code = region.currency_code
      }

      delete req.filterableFields.region_id
    }

    // If a currency code is explicitly passed, we should be using that instead of the
    // regions currency code
    if (query.currency_code) {
      const currency = await refetchEntity(
        "currency",
        { code: query.currency_code },
        req.scope,
        ["code"]
      )

      if (currency) {
        pricingContext.currency_code = currency.code
      }

      delete req.filterableFields.currency_code
    }

    // Find all the customer groups the customer is a part of and set
    if (customerId) {
      const customerGroups = await refetchEntities(
        "customer_group",
        { customer_id: customerId },
        req.scope,
        ["id"]
      )

      pricingContext.customer_group_id = customerGroups.map((cg) => cg.id)

      delete req.filterableFields.customer_id
    }

    // If a currency_code is not present in the context, we will not be able to calculate prices
    if (
      !isPresent(pricingContext) ||
      !isPresent(pricingContext.currency_code)
    ) {
      try {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Valid pricing parameters (currency_code or region_id) are required to calculate prices`
        )
      } catch (e) {
        return next(e)
      }
    }

    req.pricingContext = pricingContext

    if (!withCalculatedPrice) {
      req.remoteQueryConfig.fields.push("variants.calculated_price.*")
    }

    return next()
  }
}
