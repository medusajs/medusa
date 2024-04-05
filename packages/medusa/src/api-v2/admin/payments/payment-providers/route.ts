import { ModuleRegistrationName } from "@medusajs/modules-sdk"

import { IPaymentModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const paymentModule = req.scope.resolve<IPaymentModuleService>(
    ModuleRegistrationName.PAYMENT
  )

  const [payment_providers, count] =
    await paymentModule.listAndCountPaymentProviders(req.filterableFields, {
      order: req.listConfig.order,
      skip: req.listConfig.skip,
      take: req.listConfig.take,
    })

  res.status(200).json({
    count,
    payment_providers,
    offset: req.listConfig.skip,
    limit: req.listConfig.take,
  })
}
