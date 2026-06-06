import {
  CreateAccountHolderDTO,
  IPaymentModuleService,
} from "@zjedene-medusa/framework/types"
import { isPresent, Modules } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

export const createPaymentAccountHolderStepId = "create-payment-account-holder"
/**
 * This step creates the account holder in the payment provider.
 *
 * @example
 * const accountHolder = createPaymentAccountHolderStep({
 *   provider_id: "pp_stripe_stripe",
 *   context: {
 *     customer: {
 *       id: "cus_123",
 *       email: "example@gmail.com"
 *     }
 *   }
 * })
 */
export const createPaymentAccountHolderStep = createStep(
  createPaymentAccountHolderStepId,
  async (data: CreateAccountHolderDTO, { container }) => {
    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)

    const accountHolder = await service.createAccountHolder(data)

    // createAccountHolder is an idempotent operation.
    // We pass the account holder to the compensation step if it was actually created to avoid deleting the existing account holder.
    const createdAccountHolder = isPresent(data.context.account_holder)
      ? null
      : accountHolder

    return new StepResponse(accountHolder, createdAccountHolder)
  },
  async (createdAccountHolder, { container }) => {
    if (!createdAccountHolder) {
      return
    }

    const service = container.resolve<IPaymentModuleService>(Modules.PAYMENT)
    await service.deleteAccountHolder(createdAccountHolder.id)
  }
)
