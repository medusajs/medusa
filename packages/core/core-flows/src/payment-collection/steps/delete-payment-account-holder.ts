import { IPaymentModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const deletePaymentAccountHolderStepId = "delete-payment-account-holder"
/**
 * This step deletes an account holder, also in the payment provider.
 *
 * @example
 * deletePaymentAccountHolderStep({ id: "acchld_123" })
 */
export const deletePaymentAccountHolderStep = createStep(
  deletePaymentAccountHolderStepId,
  async (input: { id: string }, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)
    await service.deleteAccountHolder(input.id)

    return new StepResponse(input.id)
  }
)
