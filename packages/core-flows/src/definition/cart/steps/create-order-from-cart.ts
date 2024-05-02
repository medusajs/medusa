import { CartWorkflowDTO } from "@medusajs/types"
import { OrderStatus } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createOrdersWorkflow } from "../../../order/workflows/create-orders"

interface StepInput {
  cart: CartWorkflowDTO
}

export const createOrderFromCartWorkflowId = "create-order-from-cart"
export const createOrderFromCartWorkflow = createStep(
  createOrderFromCartWorkflowId,
  async (input: StepInput, { container }) => {
    const { cart } = input

    const { transaction, result } = await createOrdersWorkflow(container).run({
      input: {
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
        // TODO: fetch promo codes from adjustments
        promo_codes: [],
      },
    })

    return new StepResponse(result, { transaction })
  },
  async (flow, { container }) => {
    if (!flow) {
      return
    }

    await createOrdersWorkflow(container).cancel({
      transaction: flow.transaction,
    })
  }
)
