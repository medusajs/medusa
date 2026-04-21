import { MedusaError } from "@medusajs/framework/utils"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { CustomerDTO } from "@medusajs/framework/types"

import { ModuleGiftCard } from "../../../types"
import { claimStoreCreditAccountWorkflow } from "../../store-credit/workflows/claim-store-credit-account"

/**
 * Input to claim a gift card for a customer.
 */
export type ClaimGiftCardWorkflowInput = {
  /**
   * The code of the gift card to claim.
   */
  code: string
  /**
   * The ID of the customer claiming the gift card.
   */
  customer_id: string
}

/**
 * This step validates that a gift card can be claimed. It throws an error if the
 * gift card does not have a store credit account, the gift card's store credit account
 * has no code, or the customer does not have a registered account.
 *
 * @example
 * const data = validateClaimGiftCardInputStep({
 *   giftCard: {
 *     id: "gc_123",
 *     store_credit_account: { id: "sca_123", code: "SC-XXXX" },
 *     // other gift card properties...
 *   },
 *   customer: {
 *     has_account: true,
 *     // other customer properties...
 *   },
 * })
 */
export const validateClaimGiftCardInputStep = createStep(
  "validate-claim-gift-card-input",
  async function (args: {
    giftCard: ModuleGiftCard & {
      store_credit_account: { id: string; code: string }
    }
    customer: CustomerDTO
  }) {
    const { giftCard, customer } = args

    if (!giftCard.store_credit_account?.id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Gift card does not have a store credit account"
      )
    }

    if (!giftCard.store_credit_account.code) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Gift card does not have a store credit account code"
      )
    }

    if (!customer.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Only customers with an account can claim a gift card"
      )
    }
  }
)
/**
 * This workflow claims a gift card for a customer. It validates the gift card
 * and customer, then transfers the gift card's store credit account balance to
 * the customer's store credit account. The customer must have a registered account
 * to claim a gift card.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around gift card claiming.
 *
 * @example
 * await claimGiftCardWorkflow(container)
 *   .run({
 *     input: {
 *       code: "GC-XXXX-XXXX",
 *       customer_id: "cust_123",
 *     },
 *   })
 *
 * @summary
 *
 * Claim a gift card for a customer.
 */
export const claimGiftCardWorkflow = createWorkflow(
  "claim-gift-card",
  function (input: ClaimGiftCardWorkflowInput) {
    const giftCardData = useQueryGraphStep({
      entity: "gift_card",
      fields: [
        "id",
        "code",
        "customer_id",
        "currency_code",
        "status",
        "store_credit_account.id",
        "store_credit_account.code",
      ],
      filters: { code: input.code },
    }).config({
      name: "gift-card-data",
    })

    const giftCard = transform({ giftCardData }, ({ giftCardData }) => {
      return giftCardData.data[0]
    })

    const customerData = useQueryGraphStep({
      entity: "customer",
      fields: ["id", "email", "has_account"],
      filters: { id: input.customer_id },
    }).config({
      name: "customer-data",
    })

    const customer = transform({ customerData }, ({ customerData }) => {
      return customerData.data[0]
    })

    validateClaimGiftCardInputStep({ giftCard, customer })

    const accountCode = transform({ giftCard }, ({ giftCard }) => {
      return giftCard.store_credit_account.code
    })

    claimStoreCreditAccountWorkflow.runAsStep({
      input: {
        code: accountCode,
        customer_id: customer.id,
      },
    })

    return new WorkflowResponse(void 0)
  }
)
