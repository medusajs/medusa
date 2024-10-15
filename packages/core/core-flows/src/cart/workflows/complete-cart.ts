import {
  CartWorkflowDTO,
  UsageComputedActions,
} from "@medusajs/framework/types"
import {
  Modules,
  OrderStatus,
  OrderWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createRemoteLinkStep,
  emitEventStep,
  useRemoteQueryStep,
} from "../../common"
import { useQueryStep } from "../../common/steps/use-query"
import { createOrdersStep } from "../../order/steps/create-orders"
import { authorizePaymentSessionStep } from "../../payment/steps/authorize-payment-session"
import { registerUsageStep } from "../../promotion/steps/register-usage"
import { updateCartsStep, validateCartPaymentsStep } from "../steps"
import { reserveInventoryStep } from "../steps/reserve-inventory"
import { completeCartFields } from "../utils/fields"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"
import {
  prepareAdjustmentsData,
  prepareLineItemData,
  prepareTaxLinesData,
} from "../utils/prepare-line-item-data"

export type CompleteCartWorkflowInput = {
  id: string
}

export const THREE_DAYS = 60 * 60 * 24 * 3

export const completeCartWorkflowId = "complete-cart"
/**
 * This workflow completes a cart.
 */
export const completeCartWorkflow = createWorkflow(
  {
    name: completeCartWorkflowId,
    store: true,
    idempotent: true,
    retentionTime: THREE_DAYS,
  },
  (
    input: WorkflowData<CompleteCartWorkflowInput>
  ): WorkflowResponse<{ id: string }> => {
    const orderCart = useQueryStep({
      entity: "order_cart",
      fields: ["cart_id", "order_id"],
      filters: { cart_id: input.id },
    })

    const orderId = transform({ orderCart }, ({ orderCart }) => {
      return orderCart.data[0]?.order_id
    })

    // If order ID does not exist, we are completing the cart for the first time
    const order = when({ orderId }, ({ orderId }) => {
      return !orderId
    }).then(() => {
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

      const { variants, sales_channel_id } = transform({ cart }, (data) => {
        const variantsMap: Record<string, any> = {}
        const allItems = data.cart?.items?.map((item) => {
          variantsMap[item.variant_id] = item.variant

          return {
            id: item.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          }
        })

        return {
          variants: Object.values(variantsMap),
          items: allItems,
          sales_channel_id: data.cart.sales_channel_id,
        }
      })

      const cartToOrder = transform({ cart }, ({ cart }) => {
        const allItems = (cart.items ?? []).map((item) => {
          return prepareLineItemData({
            item,
            variant: item.variant,
            unitPrice: item.raw_unit_price ?? item.unit_price,
            compareAtUnitPrice:
              item.raw_compare_at_unit_price ?? item.compare_at_unit_price,
            isTaxInclusive: item.is_tax_inclusive,
            quantity: item.raw_quantity ?? item.quantity,
            metadata: item?.metadata,
            taxLines: item.tax_lines ?? [],
            adjustments: item.adjustments ?? [],
          })
        })

        const shippingMethods = (cart.shipping_methods ?? []).map((sm) => {
          return {
            name: sm.name,
            description: sm.description,
            amount: sm.raw_amount ?? sm.amount,
            is_tax_inclusive: sm.is_tax_inclusive,
            shipping_option_id: sm.shipping_option_id,
            data: sm.data,
            metadata: sm.metadata,
            tax_lines: prepareTaxLinesData(sm.tax_lines ?? []),
            adjustments: prepareAdjustmentsData(sm.adjustments ?? []),
          }
        })

        const itemAdjustments = allItems
          .map((item) => item.adjustments ?? [])
          .flat(1)
        const shippingAdjustments = shippingMethods
          .map((sm) => sm.adjustments ?? [])
          .flat(1)

        const promoCodes = [...itemAdjustments, ...shippingAdjustments]
          .map((adjustment) => adjustment.code)
          .filter(Boolean)

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
          items: allItems,
          shipping_methods: shippingMethods,
          metadata: cart.metadata,
          promo_codes: promoCodes,
        }
      })

      const createdOrders = createOrdersStep([cartToOrder])

      const createdOrder = transform({ createdOrders }, ({ createdOrders }) => {
        return createdOrders?.[0] ?? undefined
      })

      const reservationItemsData = transform(
        { createdOrder },
        ({ createdOrder }) =>
          createdOrder.items!.map((i) => ({
            variant_id: i.variant_id,
            quantity: i.quantity,
            id: i.id,
          }))
      )

      const formatedInventoryItems = transform(
        {
          input: {
            sales_channel_id,
            variants,
            items: reservationItemsData,
          },
        },
        prepareConfirmInventoryInput
      )

      const updateCompletedAt = transform({ cart }, ({ cart }) => {
        return {
          id: cart.id,
          completed_at: new Date(),
        }
      })

      parallelize(
        createRemoteLinkStep([
          {
            [Modules.ORDER]: { order_id: createdOrder.id },
            [Modules.CART]: { cart_id: cart.id },
          },
          {
            [Modules.ORDER]: { order_id: createdOrder.id },
            [Modules.PAYMENT]: {
              payment_collection_id: cart.payment_collection.id,
            },
          },
        ]),
        updateCartsStep([updateCompletedAt]),
        reserveInventoryStep(formatedInventoryItems),
        emitEventStep({
          eventName: OrderWorkflowEvents.PLACED,
          data: { id: createdOrder.id },
        })
      )

      const promotionUsage = transform(
        { cart },
        ({ cart }: { cart: CartWorkflowDTO }) => {
          const promotionUsage: UsageComputedActions[] = []

          const itemAdjustments = (cart.items ?? [])
            .map((item) => item.adjustments ?? [])
            .flat(1)

          const shippingAdjustments = (cart.shipping_methods ?? [])
            .map((item) => item.adjustments ?? [])
            .flat(1)

          for (const adjustment of itemAdjustments) {
            promotionUsage.push({
              amount: adjustment.amount,
              code: adjustment.code!,
            })
          }

          for (const adjustment of shippingAdjustments) {
            promotionUsage.push({
              amount: adjustment.amount,
              code: adjustment.code!,
            })
          }

          return promotionUsage
        }
      )

      registerUsageStep(promotionUsage)

      return createdOrder
    })

    const result = transform({ order, orderId }, ({ order, orderId }) => {
      return { id: order?.id ?? orderId }
    })

    return new WorkflowResponse(result)
  }
)
