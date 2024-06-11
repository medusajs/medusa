import { OrderDTO } from "@medusajs/types"
import { Modules, OrderEvents } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createRemoteLinkStep,
  emitEventStep,
  useRemoteQueryStep,
} from "../../../common"
import { authorizePaymentSessionStep } from "../../../payment/steps/authorize-payment-session"
import { createOrderFromCartStep, validateCartPaymentsStep } from "../steps"
import { reserveInventoryStep } from "../steps/reserve-inventory"
import { completeCartFields } from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"

export const completeCartWorkflowId = "complete-cart"
export const completeCartWorkflow = createWorkflow(
  completeCartWorkflowId,
  (input: WorkflowData<any>): WorkflowData<OrderDTO> => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: completeCartFields,
      variables: { id: input.id },
      list: false,
    })

    const paymentSessions = validateCartPaymentsStep({ cart })

    authorizePaymentSessionStep({
      // We choose the first payment session, as there will only be one active payment session
      // This might change in the future.
      id: paymentSessions[0].id,
      context: { cart_id: cart.id },
    })

    const { variants, items, sales_channel_id } = transform(
      { cart },
      (data) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        data.cart.items.forEach((item) => {
          allItems.push({
            id: item.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })
          allVariants.push(item.variant)
        })

        return {
          variants: allVariants,
          items: allItems,
          sales_channel_id: data.cart.sales_channel_id,
        }
      }
    )

    const formatedInventoryItems = confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id,
        variants,
        items,
      },
    })

    const [, finalCart] = parallelize(
      reserveInventoryStep(formatedInventoryItems),
      useRemoteQueryStep({
        entry_point: "cart",
        fields: completeCartFields,
        variables: { id: input.id },
        list: false,
      }).config({ name: "final-cart" })
    )

    const order = createOrderFromCartStep({ cart: finalCart })

    createRemoteLinkStep([
      {
        [Modules.ORDER]: { order_id: order.id },
        [Modules.CART]: { cart_id: finalCart.id },
      },
      {
        [Modules.ORDER]: { order_id: order.id },
        [Modules.PAYMENT]: {
          payment_collection_id: cart.payment_collection.id,
        },
      },
    ])

    emitEventStep({ eventName: OrderEvents.placed, data: { id: order.id } })

    return order
  }
)
