import {
  IPaymentModuleService,
  ReplaceAccountHolderDTO,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

export const replacePaymentAccountHolderStepId =
  "replace-payment-account-holder"
/**
 * This step replaces an account holder's record in the payment provider with a new one.
 *
 * @example
 * const accountHolder = replacePaymentAccountHolderStep({
 *   id: "acchld_123",
 *   provider_id: "pp_stripe_stripe",
 *   context: {
 *     customer: {
 *       id: "cus_123",
 *       email: "jane@example.com",
 *     },
 *   },
 * })
 */
export const replacePaymentAccountHolderStep = createStep(
  replacePaymentAccountHolderStepId,
  async (input: ReplaceAccountHolderDTO, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)
    const accountHolder = await service.replaceAccountHolder(input)

    return new StepResponse(accountHolder)
  }
)
