import {
  BigNumberInput,
  CustomerDTO,
  OrderDTO,
} from "@medusajs/framework/types"
import { MathBN, MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  addOrderTransactionStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"

import {
  IStoreCreditModuleService,
  ModuleStoreCreditAccount,
  PluginModule,
} from "../../../types"
import { creditAccountsWorkflow } from "../../store-credit/workflows/credit-accounts"

const validateRefundOrderToStoreCreditStep = createStep(
  "validate-refund-order-to-store-credit",
  async function ({
    customer,
    amount,
    order,
  }: {
    customer: CustomerDTO
    amount: BigNumberInput
    order: OrderDTO
  }) {
    if (!customer?.has_account) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Store credit refunds can only be issued to registered customers"
      )
    }

    if (MathBN.lte(amount, 0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Refund amount must be greater than 0"
      )
    }

    // Guard the admin-callable endpoint: only an overpaid order (a negative
    // pending difference) can be refunded to store credit. On a balanced or
    // underpaid order, the negative order transaction added below would push
    // the order into an artificial underpayment while still funding the
    // customer's store credit.
    const pendingDifference =
      order.summary?.raw_pending_difference ??
      order.summary?.pending_difference ??
      0

    if (MathBN.gte(pendingDifference, 0)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The order has no outstanding overpayment to refund to store credit"
      )
    }
  }
)

/**
 * Input for {@link ensureStoreCreditAccountStep}.
 */
export type EnsureStoreCreditAccountStepInput = {
  /**
   * The order whose customer should be credited.
   */
  order: OrderDTO
  /**
   * The customer's existing store credit account in the order's currency, if any.
   */
  storeCreditAccount?: ModuleStoreCreditAccount
}

/**
 * Returns the customer's store credit account for the order's currency,
 * creating one if it does not exist yet.
 */
export const ensureStoreCreditAccountStep = createStep(
  "ensure-store-credit-account",
  async function (
    { order, storeCreditAccount }: EnsureStoreCreditAccountStepInput,
    { container }
  ): Promise<StepResponse<ModuleStoreCreditAccount, string | null>> {
    if (storeCreditAccount) {
      return new StepResponse(storeCreditAccount, null)
    }

    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    )

    const created = await module.createStoreCreditAccounts({
      customer_id: order.customer_id!,
      currency_code: order.currency_code,
    })

    return new StepResponse(created, created.id)
  },
  async (createdId, { container }) => {
    if (!createdId) {
      return
    }

    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    )

    await module.deleteStoreCreditAccounts([createdId])
  }
)

/**
 * Input to refund an order amount to the customer's store credit account.
 */
export interface RefundOrderToStoreCreditWorkflowInput {
  /**
   * The ID of the order to refund.
   */
  order_id: string
  /**
   * The amount to refund (positive number).
   */
  amount: BigNumberInput
  /**
   * An optional note to attach to the refund.
   */
  note?: string
}

/**
 * This workflow refunds an outstanding order overpayment to the customer's
 * store credit account. It mirrors a payment-method refund on the paid side:
 *
 * - A negative order transaction is added so that the paid total decreases and
 *   the outstanding amount (`pending_difference`) returns to zero, **without**
 *   creating a credit line — so `credit_line_total` stays `0` and the order
 *   total / "Total After Discount" keep showing the real amount.
 * - The customer's store credit account is credited by the same amount.
 *
 * The refund is capped to the order's overpayment (the negative pending
 * difference). This absorbs sub-cent rounding exactly like the payment-method
 * refund: refunding the rounded amount (e.g. `2.38` on a `-2.376` overpayment)
 * settles `pending_difference` on `0` and credits the true overpayment.
 *
 * Guest customers (without a registered account) cannot receive store credit
 * refunds and the workflow throws.
 *
 * @example
 * await refundOrderToStoreCreditWorkflow(container)
 *   .run({
 *     input: {
 *       order_id: "order_123",
 *       amount: 30,
 *     },
 *   })
 *
 * @summary
 *
 * Refund an order overpayment to the customer's store credit account.
 */
export const refundOrderToStoreCreditWorkflow = createWorkflow(
  "refund-order-to-store-credit",
  function (input: WorkflowData<RefundOrderToStoreCreditWorkflowInput>) {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: ["id", "customer_id", "currency_code", "summary"],
      filters: { id: input.order_id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-order-query" })

    const order = transform({ orderQuery }, ({ orderQuery }) => {
      return orderQuery.data[0] as OrderDTO
    })

    const customerQuery = useQueryGraphStep({
      entity: "customer",
      filters: { id: order.customer_id },
      fields: ["id", "email", "has_account"],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-customer-query" })

    const customer = transform({ customerQuery }, ({ customerQuery }) => {
      return customerQuery.data[0] as CustomerDTO
    })

    validateRefundOrderToStoreCreditStep({
      customer,
      amount: input.amount,
      order,
    })

    const storeCreditAccountsQuery = useQueryGraphStep({
      entity: "store_credit_account",
      filters: {
        customer_id: order.customer_id,
        currency_code: order.currency_code,
      },
      fields: ["id", "customer_id", "currency_code", "balance"],
    }).config({ name: "get-store-credit-accounts-query" })

    const existingStoreCreditAccount = transform(
      { storeCreditAccountsQuery },
      ({ storeCreditAccountsQuery }) => {
        return storeCreditAccountsQuery.data[0] as
          | ModuleStoreCreditAccount
          | undefined
      }
    )

    const storeCreditAccount = ensureStoreCreditAccountStep({
      order,
      storeCreditAccount: existingStoreCreditAccount,
    })

    // Cap the refund to the order's overpayment (the negative pending
    // difference, guaranteed to exist by the validation step above). This never
    // over-credits, keeps the order balanced on the paid side, and absorbs
    // sub-cent rounding: refunding the rounded amount (2.38) on a -2.376
    // overpayment settles pending_difference exactly on 0, with no credit line.
    const refundAmount = transform({ order, input }, ({ order, input }) => {
      const pendingDifference =
        order.summary?.raw_pending_difference ??
        order.summary?.pending_difference ??
        0

      const overpayment = MathBN.mult(pendingDifference, -1)
      const amountToRefund = MathBN.convert(input.amount)

      return MathBN.gt(amountToRefund, overpayment)
        ? overpayment
        : amountToRefund
    })

    const creditAccountTransactions = transform(
      { input, refundAmount, storeCreditAccount, order },
      ({ input, refundAmount, storeCreditAccount, order }) => {
        return [
          {
            account_id: storeCreditAccount.id,
            amount: refundAmount,
            reference: "order",
            reference_id: order.id,
            note: input.note ?? "Store credit refund",
          },
        ]
      }
    )

    // Credit the store credit account first so the resulting ledger transaction
    // id can be used as a unique reference for the order transaction below.
    const creditTransactions = creditAccountsWorkflow.runAsStep({
      input: creditAccountTransactions,
    })

    const transactionData = transform(
      { order, refundAmount, creditTransactions, storeCreditAccount },
      ({ order, refundAmount, creditTransactions, storeCreditAccount }) => {
        const ledgerTransaction = Array.isArray(creditTransactions)
          ? creditTransactions[0]
          : creditTransactions

        return {
          order_id: order.id,
          amount: MathBN.mult(refundAmount, -1),
          currency_code: order.currency_code,
          reference: "store-credit-account",
          // Unique per refund (the store-credit ledger transaction id), so the
          // `addOrderTransactionStep` dedup on (order_id, reference, reference_id)
          // never skips a legitimate repeated refund — which would otherwise
          // leave `pending_difference` negative.
          reference_id: ledgerTransaction?.id ?? storeCreditAccount.id,
        }
      }
    )

    addOrderTransactionStep(transactionData)

    return new WorkflowResponse(void 0)
  }
)
