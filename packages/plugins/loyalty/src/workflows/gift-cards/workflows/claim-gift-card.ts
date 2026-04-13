import crypto from "crypto"

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

type ClaimGiftCardInput = {
  /**
   * The code of the gift card
   */
  code: string
  /**
   * The id of the customer
   */
  customer_id: string
}

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
/*
  A workflow that claims a gift card for a customer.
  The gift card is debited and customer account is credited.
*/
export const claimGiftCardWorkflow = createWorkflow(
  "claim-gift-card",
  function (input: ClaimGiftCardInput) {
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
