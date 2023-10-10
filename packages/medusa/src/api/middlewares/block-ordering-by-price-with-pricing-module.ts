import { FlagRouter, MedusaError } from "@medusajs/utils"
import { NextFunction, Request, Response } from "express"

import PricingIntegrationFeatureFlag from "../../loaders/feature-flags/pricing-integration"

/**
 * Middleware that includes the default sales channel on the request, if no sales channels present
 * @param context Object of options
 * @param context.attachChannelAsArray Whether to attach the default sales channel as an array or just a string
 */
export function blockOrderByPriceWithPricingModule(
  entity: string
): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _, next: NextFunction) => {
    const featureFlagRouter = req.scope.resolve(
      "featureFlagRouter"
    ) as FlagRouter

    const listConfigOrder = req.listConfig.order

    if (
      !featureFlagRouter.isFeatureEnabled(PricingIntegrationFeatureFlag.key) ||
      !listConfigOrder
    ) {
      return next()
    }

    if (
      Object.keys(listConfigOrder).some((orderKey) =>
        orderKey.includes("price")
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `${entity} cannot order by price when using a pricing module`
      )
    } else {
      next()
    }
  }
}
