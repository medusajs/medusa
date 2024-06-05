import { completeCartWorkflow } from "@medusajs/core-flows"
import {
  MedusaError,
  ModuleRegistrationName,
  TransactionState,
} from "@medusajs/utils"
import { MedusaRequest, MedusaResponse } from "../../../../../types/routing"
import { prepareRetrieveQuery } from "../../../../../utils/get-query-config"
import { refetchEntity } from "../../../../utils/refetch-entity"
import { refetchOrder } from "../../../orders/helpers"
import { refetchCart } from "../../helpers"
import { defaultStoreCartFields } from "../../query-config"
import { StoreCompleteCartType } from "../../validators"

export const POST = async (
  req: MedusaRequest<StoreCompleteCartType>,
  res: MedusaResponse
) => {
  const cart_id = req.params.id

  const eventBusModule = req.scope.resolve(ModuleRegistrationName.EVENT_BUS)

  const { errors, result } = await completeCartWorkflow(req.scope).run({
    input: { id: cart_id },
    context: { transactionId: cart_id },
    throwOnError: false,
    events: {
      onFinish: async ({ transaction }) => {
        const state = transaction.getState()

        // We only want to emit the order.placed event if the workflow completed
        if (state !== TransactionState.DONE) {
          return
        }

        const result = await refetchEntity(
          "order_cart",
          { cart_id },
          req.scope,
          ["order_id", "cart_id"]
        )

        await eventBusModule.emit("order.placed", { id: result.order_id })
      },
    },
  })

  // When an error occurs on the workflow, its potentially got to with cart validations, payments
  // or inventory checks. Return the cart here along with errors for the consumer to take more action
  // and fix them
  if (errors?.[0]) {
    const error = errors[0].error
    const statusOKErrors: string[] = [
      // TODO: add inventory specific errors
      MedusaError.Types.PAYMENT_AUTHORIZATION_ERROR,
      MedusaError.Types.PAYMENT_REQUIRES_MORE_ERROR,
    ]

    // If we end up with errors outside of statusOKErrors, it means that the cart is not in a state to be
    // completed. In these cases, we return a 400.
    const cart = await refetchCart(
      cart_id,
      req.scope,
      prepareRetrieveQuery(
        {},
        {
          defaults: defaultStoreCartFields,
        }
      ).remoteQueryConfig.fields
    )

    if (!statusOKErrors.includes(error.type)) {
      throw error
    }

    res.status(200).json({
      type: "cart",
      cart,
      error: {
        message: error.message,
        name: error.name,
        type: error.type,
      },
    })
  }

  const order = await refetchOrder(
    result.id,
    req.scope,
    req.remoteQueryConfig.fields
  )

  res.status(200).json({
    type: "order",
    order,
  })
}
