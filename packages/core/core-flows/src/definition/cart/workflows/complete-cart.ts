import { OrderDTO } from "@medusajs/types"
import { Modules, OrderEvents, OrderStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  parallelize,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createRemoteLinkStep,
  emitEventStep,
  useRemoteQueryStep,
} from "../../../common"
import { createOrdersStep } from "../../../order/steps/create-orders"
import { authorizePaymentSessionStep } from "../../../payment/steps/authorize-payment-session"
import { validateCartPaymentsStep } from "../steps"
import { reserveInventoryStep } from "../steps/reserve-inventory"
import { completeCartFields } from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"

export const completeCartWorkflowId = "complete-cart"
export const completeCartWorkflow = createWorkflow(
  completeCartWorkflowId,
  (input: WorkflowData<any>): WorkflowResponse<OrderDTO> => {
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

    const cartToOrder = transform({ input, cart }, ({ cart }) => {
      const itemAdjustments = (cart.items || [])
        ?.map((item) => item.adjustments || [])
        .flat(1)
      const shippingAdjustments = (cart.shipping_methods || [])
        ?.map((sm) => sm.adjustments || [])
        .flat(1)

      const promoCodes = [...itemAdjustments, ...shippingAdjustments]
        .map((adjustment) => adjustment.code)
        .filter((code) => Boolean) as string[]

      return {
        region_id: cart.region?.id,
        customer_id: cart.customer?.id,
        sales_channel_id: cart.sales_channel_id,
        status: OrderStatus.PENDING,
        email: cart.email,
        currency_code: cart.currency_code,
        shipping_address: cart.shipping_address,
        billing_address: cart.billing_address,
        no_notification: false,
        items: cart.items,
        shipping_methods: cart.shipping_methods,
        metadata: cart.metadata,
        promo_codes: promoCodes,
      }
    })

    const orders = createOrdersStep([cartToOrder])
    const order = transform({ orders }, ({ orders }) => orders[0])

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

    emitEventStep({ eventName: OrderEvents.PLACED, data: { id: order.id } })

    return new WorkflowResponse(order)
  }
)
