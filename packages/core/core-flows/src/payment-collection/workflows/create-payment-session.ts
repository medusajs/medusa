import {
  AccountHolderDTO,
  CustomerDTO,
  PaymentSessionDTO,
} from "@medusajs/framework/types"
import {
  isPresent,
  Modules,
  PaymentSessionStatus,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { createRemoteLinkStep, useRemoteQueryStep } from "../../common"
import {
  createPaymentAccountHolderStep,
  createPaymentSessionStep,
  updatePaymentSessionStep,
} from "../steps"
import { deletePaymentSessionsWorkflow } from "./delete-payment-sessions"

/**
 * The data to create payment sessions.
 */
export interface CreatePaymentSessionsWorkflowInput {
  /**
   * The ID of the payment collection to create payment sessions for.
   */
  payment_collection_id: string
  /**
   * The ID of the payment provider that the payment sessions are associated with.
   * This provider is used to later process the payment sessions and their payments.
   */
  provider_id: string
  /**
   * The ID of the customer that the payment session should be associated with.
   */
  customer_id?: string
  /**
   * Custom data relevant for the payment provider to process the payment session.
   * Learn more in [this documentation](https://docs.medusajs.com/resources/commerce-modules/payment/payment-session#data-property).
   */
  data?: Record<string, unknown>

  /**
   * Additional context that's useful for the payment provider to process the payment session.
   * Currently all of the context is calculated within the workflow.
   */
  context?: Record<string, unknown>
}

export const createPaymentSessionsWorkflowId = "create-payment-sessions"
/**
 * This workflow creates payment sessions. It's used by the
 * [Initialize Payment Session Store API Route](https://docs.medusajs.com/api/store#payment-collections_postpaymentcollectionsidpaymentsessions).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create payment sessions in your custom flows.
 *
 * @example
 * const { result } = await createPaymentSessionsWorkflow(container)
 * .run({
 *   input: {
 *     payment_collection_id: "paycol_123",
 *     provider_id: "pp_system"
 *   }
 * })
 *
 * @summary
 *
 * Create payment sessions.
 */
export const createPaymentSessionsWorkflow = createWorkflow(
  createPaymentSessionsWorkflowId,
  (
    input: WorkflowData<CreatePaymentSessionsWorkflowInput>
  ): WorkflowResponse<PaymentSessionDTO> => {
    const paymentCollection = useRemoteQueryStep({
      entry_point: "payment_collection",
      fields: ["id", "amount", "currency_code", "payment_sessions.*"],
      variables: { id: input.payment_collection_id },
      list: false,
    }).config({ name: "get-payment-collection" })

    const { paymentCustomer, accountHolder, existingAccountHolder } = when(
      "customer-id-exists",
      { input },
      (data) => {
        return !!data.input.customer_id
      }
    ).then(() => {
      const customer: CustomerDTO & { account_holders?: AccountHolderDTO[] } =
        useRemoteQueryStep({
          entry_point: "customer",
          fields: [
            "id",
            "email",
            "company_name",
            "first_name",
            "last_name",
            "phone",
            "addresses.*",
            "account_holders.*",
            "metadata",
          ],
          variables: { id: input.customer_id },
          list: false,
        }).config({ name: "get-customer" })

      const paymentCustomer = transform({ customer }, (data) => {
        return {
          ...data.customer,
          billing_address:
            data.customer.addresses?.find((a) => a.is_default_billing) ??
            data.customer.addresses?.[0],
        }
      })

      const existingAccountHolder = transform({ customer, input }, (data) => {
        return (data.customer.account_holders ?? []).find(
          (ac) => ac?.provider_id === data.input.provider_id
        )
      })

      const accountHolderInput = transform(
        { existingAccountHolder, input, paymentCustomer },
        (data) => {
          return {
            provider_id: data.input.provider_id,
            context: {
              // The module is idempotent, so if there already is a linked account holder, the module will simply return it back.
              account_holder: data.existingAccountHolder,
              customer: data.paymentCustomer,
            },
          }
        }
      )

      const accountHolder = createPaymentAccountHolderStep(
        accountHolderInput
      ).config({
        noCompensation: true,
      })

      return { paymentCustomer, accountHolder, existingAccountHolder }
    })

    when(
      "account-holder-created",
      { paymentCustomer, accountHolder, input, existingAccountHolder },
      ({ existingAccountHolder, accountHolder }) => {
        return !isPresent(existingAccountHolder) && isPresent(accountHolder)
      }
    ).then(() => {
      createRemoteLinkStep([
        {
          [Modules.CUSTOMER]: {
            customer_id: paymentCustomer.id,
          },
          [Modules.PAYMENT]: {
            account_holder_id: accountHolder.id,
          },
        },
      ])
    })

    const paymentSessionInput = transform(
      { paymentCollection, paymentCustomer, accountHolder, input },
      (data) => {
        return {
          payment_collection_id: data.input.payment_collection_id,
          provider_id: data.input.provider_id,
          data: data.input.data,
          context: {
            ...data.input.context,
            customer: data.paymentCustomer,
            account_holder: data.accountHolder,
          },
          amount: data.paymentCollection.amount,
          currency_code: data.paymentCollection.currency_code,
        }
      }
    )

    // Reuse an existing unconfirmed session for the same provider/currency by
    // updating its amount in place (keeping the same provider payment, e.g. the
    // same Stripe PaymentIntent) instead of always deleting and recreating it.
    // The reusable session is resolved BEFORE the delete so it can be excluded
    // from deletion.
    //
    // Reusable = an unconfirmed session for the SAME provider and currency. A
    // confirmed session's amount can't be changed, and a provider can't change a
    // session's currency, so those must be recreated. Currency is compared
    // case-insensitively to avoid silently falling through to a new session
    // (and a new provider payment) on a casing mismatch.
    const reusableSession = transform(
      { paymentSessionInput, paymentCollection },
      ({ paymentSessionInput, paymentCollection }) => {
        const targetCurrency = (
          paymentSessionInput.currency_code ?? ""
        ).toLowerCase()

        return (
          (paymentCollection?.payment_sessions ?? []).find(
            (s) =>
              s.provider_id === paymentSessionInput.provider_id &&
              (s.currency_code ?? "").toLowerCase() === targetCurrency &&
              (s.status === PaymentSessionStatus.PENDING ||
                s.status === PaymentSessionStatus.REQUIRES_MORE)
          ) ?? null
        )
      }
    )

    const updateResult = when(
      { reusableSession },
      ({ reusableSession }) => !!reusableSession
    ).then(() => {
      return updatePaymentSessionStep({
        id: reusableSession.id,
        amount: paymentSessionInput.amount,
        currency_code: paymentSessionInput.currency_code,
      })
    })

    // Create a fresh session when there's no reusable one, OR when the in-place
    // update failed (e.g. the provider payment vanished) and the stale session
    // was deleted as a fallback — so a missing provider payment falls back to a
    // fresh session instead of failing the route.
    const createdSession = when(
      { reusableSession, updateResult },
      ({ reusableSession, updateResult }) =>
        !reusableSession || !updateResult?.updated
    ).then(() => {
      return createPaymentSessionStep(paymentSessionInput)
    })

    // Exactly one outcome is defined: the created session takes precedence (it
    // only exists when there was no reuse or the update fell back), otherwise
    // the in-place-updated session.
    const session = transform(
      { updateResult, createdSession },
      ({ updateResult, createdSession }) =>
        (createdSession || updateResult?.session) as PaymentSessionDTO
    )

    // Note: We delete every OTHER existing session (we don't support split
    // payments at the moment); the reused session, if any, is excluded so its
    // provider payment survives. When we are ready to accept split payments,
    // this along with other workflows need to be handled correctly.
    const deletePaymentSessionInput = transform(
      { paymentCollection, reusableSession },
      ({ paymentCollection, reusableSession }) => {
        const ids = (
          paymentCollection?.payment_sessions?.map((ps) => ps.id) || []
        ).filter((id) => id !== reusableSession?.id)

        return { ids }
      }
    )

    deletePaymentSessionsWorkflow.runAsStep({
      input: deletePaymentSessionInput,
    })

    return new WorkflowResponse(session)
  }
)
