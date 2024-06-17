import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FindConfig,
  IPaymentModuleService,
  PaymentCollectionDTO,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

interface StepInput {
  id: string
  config?: FindConfig<PaymentCollectionDTO>
}

export const retrievePaymentCollectionStepId = "retrieve-payment-collection"
export const retrievePaymentCollectionStep = createStep(
  retrievePaymentCollectionStepId,
  async (data: StepInput, { container }) => {
    const paymentModuleService = container.resolve<IPaymentModuleService>(
      ModuleRegistrationName.PAYMENT
    )

    const paymentCollection =
      await paymentModuleService.retrievePaymentCollection(data.id, data.config)

    return new StepResponse(paymentCollection)
  }
)
