import { ModuleRegistrationName } from "@medusajs/modules-sdk"

import { IPaymentModuleService } from "@medusajs/types"
import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "../../../../types/routing"
import { AdminGetPaymentsPaymentProvidersParams } from "../validators"

export const GET = async (
  req: AuthenticatedMedusaRequest<AdminGetPaymentsPaymentProvidersParams>,
  res: MedusaResponse
) => {
  const paymentModule = req.scope.resolve<IPaymentModuleService>(
    ModuleRegistrationName.PAYMENT
  )

  const [payment_providers, count] =
    await paymentModule.listAndCountPaymentProviders(req.filterableFields, {
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
