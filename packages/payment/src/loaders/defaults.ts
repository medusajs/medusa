import { IPaymentModuleService, LoaderOptions } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

export default async ({ container }: LoaderOptions): Promise<void> => {
  const paymentModuleService: IPaymentModuleService = container.resolve(
    ModuleRegistrationName.PAYMENT
  )

  await paymentModuleService.createProvidersOnLoad()
}
