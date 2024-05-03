import { CartWorkflowDTO } from "@medusajs/types"
import { OrderStatus } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { createOrdersWorkflow } from "../../../order/workflows/create-orders"

interface StepInput {
  cart: CartWorkflowDTO
}

export const createOrderFromCartStepId = "create-order-from-cart"
export const createOrderFromCartStep = createStep(
  createOrderFromCartStepId,
  async (input: StepInput, { container }) => {
    const { cart } = input

    const itemAdjustments = (cart.items || [])
      ?.map((item) => item.adjustments || [])
      .flat(1)
    const shippingAdjustments = (cart.shipping_methods || [])
      ?.map((sm) => sm.adjustments || [])
      .flat(1)

    const promoCodes = [...itemAdjustments, ...shippingAdjustments]
      .map((adjustment) => adjustment.code)
      .filter((code) => Boolean) as string[]

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
        // TODO: This should be handle correctly
        no_notification: false,
        items: cart.items,
        shipping_methods: cart.shipping_methods,
        metadata: cart.metadata,
        promo_codes: promoCodes,
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
