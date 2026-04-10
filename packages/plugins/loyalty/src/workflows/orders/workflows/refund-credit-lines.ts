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
import crypto from "crypto"
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

export const creditAccountTransactionsStep = createStep(
  "credit-account-transactions",
  async function (
    {
      storeCreditAccount,
      order,
      creditLines,
    }: {
      order: OrderDTO
      storeCreditAccount: ModuleStoreCreditAccount
      creditLines: OrderCreditLineDTO[]
    },
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

/*
  A workflow that credits a store credit account
*/
export const refundCreditLinesWorkflow = createWorkflow(
  "refund-credit-lines",
  function (input: { order_id: string; credit_lines: OrderCreditLineDTO[] }) {
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
