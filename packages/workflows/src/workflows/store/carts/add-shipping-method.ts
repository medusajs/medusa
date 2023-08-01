import { Cart, StorePostCartsCartShippingMethodReq } from "@medusajs/medusa"
import {
  TransactionOrchestrator,
  TransactionState,
} from "@medusajs/orchestration"
import { MedusaContainer } from "@medusajs/types"
import { MedusaError } from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { ulid } from "ulid"
import {
  AddShippingMethodWorkflowActions,
  addShippingMethodTransactionHandler,
  addShippingMethodWorkflowSteps,
} from "../../../definitions/store/carts/add-shipping-method"

const addShippingMethodOrchestratorKey = "add-shipping-method"

const addShippingMethodOrchestrator = new TransactionOrchestrator(
  addShippingMethodOrchestratorKey,
  addShippingMethodWorkflowSteps
)

export async function addShippingMethodWorkflow(
  dependencies: {
    manager: EntityManager
    container: MedusaContainer
  },
  input: StorePostCartsCartShippingMethodReq,
  cartOrId: Cart | string
): Promise<Cart> {
  const transaction = await addShippingMethodOrchestrator.beginTransaction(
    ulid(),
    addShippingMethodTransactionHandler(dependencies),
    { ...input, cart: cartOrId }
  )

  await addShippingMethodOrchestrator.resume(transaction)

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
    AddShippingMethodWorkflowActions.result
  ] as Cart
}
