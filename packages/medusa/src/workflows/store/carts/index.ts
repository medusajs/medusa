import {
  TransactionOrchestrator,
  TransactionState,
} from "@medusajs/orchestration"
import { MedusaError, isString } from "@medusajs/utils"
import { ulid } from "ulid"
import { StorePostCartsCartShippingMethodReq } from "../../../api"
import { Cart } from "../../../models"
import { CartService } from "../../../services"
import {
  AddShippingMethodWorkflowActions,
  transactionHandler,
  workflowSteps,
} from "./definition"
import { InjectedDependencies } from "./types"

const addShippingMethodOrchestratorKey = "add-shipping-method"

const addShippingMethodOrchestrator = new TransactionOrchestrator(
  addShippingMethodOrchestratorKey,
  workflowSteps
)

export async function addShippingMethodWorkflow(
  dependencies: InjectedDependencies,
  input: StorePostCartsCartShippingMethodReq,
  cartOrId: Cart | string
): Promise<Cart> {
  const cartService = dependencies.container.resolve(
    "cartService"
  ) as CartService

  const cart = !isString(cartOrId)
    ? cartOrId
    : await cartService.retrieveWithTotals(cartOrId, {
        relations: [
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items.variant.product.profiles",
          "payment_sessions",
        ],
      })

  const transaction = await addShippingMethodOrchestrator.beginTransaction(
    ulid(),
    transactionHandler(dependencies),
    { ...input, cart }
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
