import {
  AuthenticatedMedusaRequest,
  refetchEntities,
  refetchEntity,
} from "@zjedene-medusa/framework/http"
import { MedusaPricingContext } from "@zjedene-medusa/framework/types"
import { MedusaError } from "@zjedene-medusa/framework/utils"
import { NextFunction } from "express"
import { DEFAULT_PRICE_FIELD_PATHS } from "./constants"

type PricingContextOptions = {
  priceFieldPaths?: string[]
}

export function setPricingContext(options: PricingContextOptions = {}) {
  const { priceFieldPaths = DEFAULT_PRICE_FIELD_PATHS } = options

  return async (req: AuthenticatedMedusaRequest, _, next: NextFunction) => {
    const withCalculatedPrice = req.queryConfig.fields.some((field) =>
      priceFieldPaths.some(
        (pricePath) => field === pricePath || field.startsWith(`${pricePath}.`)
      )
    )
    if (!withCalculatedPrice) {
      return next()
    }

    // We validate the region ID in the previous middleware
    const region = await refetchEntity({
      entity: "region",
      idOrFilter: req.filterableFields.region_id!,
      scope: req.scope,
      fields: ["id", "currency_code"],
      options: {
        cache: {
          enable: true,
        },
      },
    })

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
    if (req.auth_context?.actor_id) {
      const { data: customerGroups } = await refetchEntities({
        entity: "customer_group",
        idOrFilter: { customers: { id: req.auth_context.actor_id } },
        scope: req.scope,
        fields: ["id"],
      })

      pricingContext.customer = { groups: [] }
      customerGroups.map((cg) =>
        pricingContext.customer?.groups?.push({ id: cg.id })
      )
    }

    req.pricingContext = pricingContext
    return next()
  }
}
