import { ulid } from "ulid"
import { MedusaError } from "@medusajs/utils"
import {
  TransactionOrchestrator,
  TransactionState,
} from "../../../utils/transaction"
import { AdminPostProductsReq } from "../../../api"
import { Product } from "../../../models"
import { PricedProduct } from "../../../types/pricing"
import {
  CreateProductsWorkflowActions,
  transactionHandler,
  workflowSteps,
} from "./definition"
import { InjectedDependencies } from "./types"

const createProductsOrchestrator = new TransactionOrchestrator(
  "create-products",
  workflowSteps
)

export async function createProductsWorkflow(
  dependencies: InjectedDependencies,
  input: AdminPostProductsReq[]
): Promise<(Product | PricedProduct)[]> {
  const transaction = await createProductsOrchestrator.beginTransaction(
    ulid(),
    transactionHandler(dependencies),
    input
  )

  await createProductsOrchestrator.resume(transaction)

  if (transaction.getState() !== TransactionState.DONE) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      transaction
        .getErrors()
        .map((err) => err.error?.message)
        .join("\n")
    )
  }

  return transaction.getContext().invoke[
    CreateProductsWorkflowActions.result
  ] as (Product | PricedProduct)[]
}
