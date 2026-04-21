import {
  CustomerDTO,
  OrderCreditLineDTO,
  OrderDTO,
} from "@medusajs/framework/types"
import { MathBN, MedusaError } from "@medusajs/framework/utils"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import {
  IStoreCreditModuleService,
  ModuleStoreCreditAccount,
  PluginModule,
} from "../../../types"
import { creditAccountsWorkflow } from "../../store-credit/workflows/credit-accounts"

const validateCustomerStep = createStep(
  "validate-customer",
  async function ({
    customer,
    negativeCreditLines,
  }: {
    customer: CustomerDTO
    negativeCreditLines: OrderCreditLineDTO[]
  }) {
    // throw only if the customer is a guest and negative credit lines which would result in crediting a store account
    if (!customer.has_account && negativeCreditLines.length > 0) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Store credit refunds can only be issued to registered customers"
      )
    }

    return new StepResponse(void 0)
  }
)

/**
 * Input to prepare credit transactions for refunding negative order credit lines.
 */
export interface CreditAccountTransactionsStepInput {
  /**
   * The order whose credit lines are being refunded.
   */
  order: OrderDTO
  /**
   * The customer's store credit account to credit. If not found, one will be created.
   */
  storeCreditAccount: ModuleStoreCreditAccount
  /**
   * The negative credit lines to refund.
   */
  creditLines: OrderCreditLineDTO[]
}

/**
 * This step prepares credit transactions for refunding negative order credit lines
 * to a customer's store credit account. If the customer does not have a store credit
 * account in the order's currency, one is created. Returns an array of credit transactions.
 *
 * @example
 * const data = creditAccountTransactionsStep({
 *   order: {
 *     customer_id: "cust_123",
 *     currency_code: "usd",
 *     // other order properties...
 *   },
 *   storeCreditAccount: {
 *     id: "sca_123",
 *     balance: 100,
 *     // other store credit account properties...
 *   },
 *   creditLines: [
 *     {
 *       id: "cl_123",
 *       order_id: "order_123",
 *       amount: -50,
 *       // other credit line properties...
 *     }
 *   ],
 * })
 */
export const creditAccountTransactionsStep = createStep(
  "credit-account-transactions",
  async function (
    {
      storeCreditAccount,
      order,
      creditLines,
    }: CreditAccountTransactionsStepInput,
    { container }
  ) {
    const module = container.resolve<IStoreCreditModuleService>(
      PluginModule.STORE_CREDIT
    )

    const negativeCreditLines = creditLines.filter((creditLine) =>
      MathBN.convert(creditLine.amount).lt(0)
    )

    let totalCreditAmount = negativeCreditLines.reduce(
      (acc, creditLine) =>
        MathBN.add(acc, MathBN.convert(creditLine.amount).multipliedBy(-1)),
      MathBN.convert(0)
    )

    if (!storeCreditAccount) {
      storeCreditAccount = await module.createStoreCreditAccounts({
        customer_id: order.customer_id,
        currency_code: order.currency_code,
      })
    }

    const creditTransaction = {
      account_id: storeCreditAccount.id,
      amount: totalCreditAmount,
      reference: "order",
      reference_id: order.id,
      note: "Store credit refund",
    }

    return new StepResponse([creditTransaction])
  }
)

/**
 * Input to refund negative order credit lines to a customer's store credit account.
 */
export interface RefundCreditLinesWorkflowInput {
  /**
   * The ID of the order whose credit lines should be refunded.
   */
  order_id: string
  /**
   * The credit lines to process for refund.
   */
  credit_lines: OrderCreditLineDTO[]
}

/**
 * This workflow refunds negative order credit lines by crediting the customer's
 * store credit account. Guest customers cannot receive store credit refunds — only
 * registered customers are eligible.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around refunding order credit lines.
 *
 * @example
 * await refundCreditLinesWorkflow(container)
 *   .run({
 *     input: {
 *       order_id: "order_123",
 *       credit_lines: [...],
 *     },
 *   })
 *
 * @summary
 *
 * Refund negative order credit lines to a customer's store credit account.
 */
export const refundCreditLinesWorkflow = createWorkflow(
  "refund-credit-lines",
  function (input: RefundCreditLinesWorkflowInput) {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      filters: { id: input.order_id },
      fields: ["id", "customer.*", "customer_id", "currency_code"],
    }).config({ name: "get-cart-query" })

    const order = transform({ orderQuery }, ({ orderQuery }) => {
      return orderQuery.data[0]
    })

    const customerQuery = useQueryGraphStep({
      entity: "customer",
      filters: { id: order.customer_id },
      fields: ["id", "email", "has_account"],
      options: {
        throwIfKeyNotFound: true,
      },
    }).config({ name: "get-customer-query" })

    const customer = transform({ customerQuery }, ({ customerQuery }) => {
      return customerQuery.data[0]
    })

    const negativeCreditLines = transform({ input }, ({ input }) => {
      return (input.credit_lines ?? []).filter((creditLine) =>
        MathBN.convert(creditLine.amount).lt(0)
      )
    })

    validateCustomerStep({ customer, negativeCreditLines })

    const storeCreditAccountsQuery = useQueryGraphStep({
      entity: "store_credit_account",
      filters: {
        customer_id: customer.id,
        currency_code: order.currency_code,
      },
      fields: ["id", "customer_id", "balance", "credits", "debits"],
    }).config({ name: "get-store-credit-accounts-query" })

    const storeCreditAccount = transform(
      { storeCreditAccountsQuery },
      ({ storeCreditAccountsQuery }) => {
        return storeCreditAccountsQuery.data[0]
      }
    )

    when({ negativeCreditLines }, ({ negativeCreditLines }) => {
      return negativeCreditLines.length > 0
    }).then(() => {
      const creditTransactions = creditAccountTransactionsStep({
        order,
        storeCreditAccount,
        creditLines: negativeCreditLines,
      })

      creditAccountsWorkflow.runAsStep({
        input: creditTransactions,
      })
    })
  }
)
