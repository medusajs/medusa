import {
  CartCreditLineDTO,
  CartWorkflowDTO,
  LinkDefinition,
  PromotionDTO,
  UsageComputedActions,
} from "@medusajs/framework/types"
import {
  EventPriority,
  isDefined,
  Modules,
  OrderStatus,
  OrderWorkflowEvents,
} from "@medusajs/framework/utils"
import {
  createHook,
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
  useQueryGraphStep,
} from "../../common"
import { acquireLockStep } from "../../locking/steps/acquire-lock"
import { releaseLockStep } from "../../locking/steps/release-lock"
import { addOrderTransactionStep } from "../../order/steps/add-order-transaction"
import { createOrdersStep } from "../../order/steps/create-orders"
import { authorizePaymentSessionStep } from "../../payment/steps/authorize-payment-session"
import { registerUsageStep } from "../../promotion/steps/register-usage"
import {
  updateCartsStep,
  validateCartPaymentsStep,
  validateShippingStep,
} from "../steps"
import { compensatePaymentIfNeededStep } from "../steps/compensate-payment-if-needed"
import { reserveInventoryStep } from "../steps/reserve-inventory"
import { completeCartFields } from "../utils/fields"
import { prepareConfirmInventoryInput } from "../utils/prepare-confirm-inventory-input"
import {
  prepareAdjustmentsData,
  prepareLineItemData,
  PrepareLineItemDataInput,
  prepareTaxLinesData,
} from "../utils/prepare-line-item-data"
/**
 * The data to complete a cart and place an order.
 */
export type CompleteCartWorkflowInput = {
  /**
   * The ID of the cart to complete.
   */
  id: string
}

export type CompleteCartWorkflowOutput = {
  /**
   * The ID of the order that was created.
   */
  id: string
}

const THREE_DAYS = 60 * 60 * 24 * 3
const THIRTY_SECONDS = 30
const TWO_MINUTES = 60 * 2

export const completeCartWorkflowId = "complete-cart"
/**
 * This workflow completes a cart and places an order for the customer. It's executed by the
 * [Complete Cart Store API Route](https://docs.medusajs.com/api/store#carts_postcartsidcomplete).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to wrap custom logic around completing a cart.
 * For example, in the [Subscriptions recipe](https://docs.medusajs.com/resources/recipes/subscriptions/examples/standard#create-workflow),
 * this workflow is used within another workflow that creates a subscription order.
 *
 * ## Cart Completion Idempotency
 *
 * This workflow's logic is idempotent, meaning that if it is executed multiple times with the same input, it will not create duplicate orders. The
 * same order will be returned for subsequent executions with the same cart ID. This is necessary to avoid rolling back payments or causing
 * other side effects if the workflow is retried or fails due to transient errors.
 *
 * So, if you use this workflow within your own, make sure your workflow's steps are idempotent as well to avoid unintended side effects.
 * Your workflow must also acquire and release locks around this workflow to prevent concurrent executions for the same cart.
 *
 * The following sections cover some common scenarios and how to handle them.
 *
 * ### Creating Links and Linked Records
 *
 * In some cases, you might want to create custom links or linked records to the order. For example, you might want to create a link from the order to a
 * digital order.
 *
 * In such cases, ensure that your workflow's logic checks for existing links or records before creating new ones. You can query the
 * [entry point of the link](https://docs.medusajs.com/learn/fundamentals/module-links/custom-columns#method-2-using-entry-point)
 * to check for existing links before creating new ones.
 *
 * For example:
 *
 * ```ts
 * import {
 *   createWorkflow,
 *   when,
 *   WorkflowResponse
 * } from "@medusajs/framework/workflows-sdk"
 * import {
 *   useQueryGraphStep,
 *   completeCartWorkflow,
 *   acquireLockStep,
 *   releaseLockStep
 * } from "@medusajs/framework/workflows-sdk"
 * import digitalProductOrderOrderLink from "../../links/digital-product-order"
 *
 * type WorkflowInput = {
 *   cart_id: string
 * }
 *
 * const createDigitalProductOrderWorkflow = createWorkflow(
 *   "create-digital-product-order",
 *   (input: WorkflowInput) => {
 *     acquireLockStep({
 *       key: input.cart_id,
 *       timeout: 30,
 *       ttl: 120,
 *     });
 *     const { id } = completeCartWorkflow.runAsStep({
 *       input: {
 *         id: input.cart_id
 *       }
 *     })
 *
 *     const { data: existingLinks } = useQueryGraphStep({
 *       entity: digitalProductOrderOrderLink.entryPoint,
 *       fields: ["digital_product_order.id"],
 *       filters: { order_id: id },
 *     }).config({ name: "retrieve-existing-links" });
 *
 *
 *     const digital_product_order = when(
 *       "create-digital-product-order-condition",
 *       { existingLinks },
 *       (data) => {
 *         return (
 *           data.existingLinks.length === 0
 *         );
 *       }
 *     )
 *     .then(() => {
 *       // create digital product order logic...
 *     })
 *
 *     // other workflow logic...
 *
 *     releaseLockStep({
 *       key: input.cart_id,
 *     })
 *
 *     return new WorkflowResponse({
 *       // workflow output...
 *     })
 *   }
 * )
 * ```
 *
 * ### Custom Validation with Conflicts
 *
 * Some use cases require custom validation that may cause conflicts on subsequent executions of the workflow.
 * For example, if you're selling tickets to an event, you might want to validate that the tickets are available
 * on selected dates.
 *
 * In this scenario, if the workflow is retried after the first execution, the validation
 * will fail since the tickets would have already been reserved in the first execution. This makes the cart
 * completion non-idempotent.
 *
 * To handle these cases, you can create a step that throws an error if the validation fails. Then, in the compensation function,
 * you can cancel the order if the validation fails. For example:
 *
 * ```ts
 * import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
 * import { MedusaError } from "@medusajs/framework/utils"
 * import { cancelOrderWorkflow } from "@medusajs/medusa/core-flows"
 *
 * type StepInput = {
 *   order_id: string
 *   // other input fields...
 * }
 *
 * export const customCartValidationStep = createStep(
 *   "custom-cart-validation",
 *   async (input, { container }) => {
 *     const isValid = true // replace with actual validation logic
 *
 *     if (!isValid) {
 *       throw new MedusaError(
 *         MedusaError.Types.INVALID_DATA,
 *         "Custom cart validation failed"
 *       )
 *     }
 *
 *     return new StepResponse(void 0, input.order_id)
 *   },
 *   async (order_id, { container, context }) => {
 *     if (!order_id) return
 *
 *     cancelOrderWorkflow(container).run({
 *       input: {
 *         id: order_id,
 *       },
 *       context,
 *       container
 *     })
 *   }
 * )
 * ```
 *
 * Then, in your custom workflow, only run the validation step if the order is being created for the first time. For example,
 * only run the validation if the link from the order to your custom data does not exist yet:
 *
 * ```ts
 * import {
 *   createWorkflow,
 *   when,
 *   WorkflowResponse
 * } from "@medusajs/framework/workflows-sdk"
 * import { useQueryGraphStep } from "@medusajs/framework/workflows-sdk"
 * import ticketOrderLink from "../../links/ticket-order"
 *
 * type WorkflowInput = {
 *   cart_id: string
 * }
 *
 * const createTicketOrderWorkflow = createWorkflow(
 *   "create-ticket-order",
 *   (input: WorkflowInput) => {
 *     acquireLockStep({
 *       key: input.cart_id,
 *       timeout: 30,
 *       ttl: 120,
 *     });
 *     const { id } = completeCartWorkflow.runAsStep({
 *       input: {
 *         id: input.cart_id
 *       }
 *     })
 *
 *     const { data: existingLinks } = useQueryGraphStep({
 *       entity: ticketOrderLink.entryPoint,
 *       fields: ["ticket.id"],
 *       filters: { order_id: id },
 *     }).config({ name: "retrieve-existing-links" });
 *
 *
 *     const ticket_order = when(
 *       "create-ticket-order-condition",
 *       { existingLinks },
 *       (data) => {
 *         return (
 *           data.existingLinks.length === 0
 *         );
 *       }
 *     )
 *     .then(() => {
 *       customCartValidationStep({ order_id: id })
 *       // create ticket order logic...
 *     })
 *
 *     // other workflow logic...
 *
 *     releaseLockStep({
 *       key: input.cart_id,
 *     })
 *
 *     return new WorkflowResponse({
 *       // workflow output...
 *     })
 *   }
 * )
 * ```
 *
 * The first time this workflow is executed for a cart, the validation step will run and validate the cart. If the validation fails,
 * the order will be canceled in the compensation function.
 *
 * If the validation is successful and the workflow is retried, the validation step will be skipped since the link from the order to the
 * ticket order already exists. This ensures that the workflow remains idempotent.
 *
 * @example
 * const { result } = await completeCartWorkflow(container)
 * .run({
 *   input: {
 *     id: "cart_123"
 *   }
 * })
 *
 * @summary
 *
 * Complete a cart and place an order.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 */
export const completeCartWorkflow = createWorkflow(
  {
    name: completeCartWorkflowId,
    store: true,
    idempotent: false,
    retentionTime: THREE_DAYS,
  },
  (input: WorkflowData<CompleteCartWorkflowInput>) => {
    acquireLockStep({
      key: input.id,
      timeout: THIRTY_SECONDS,
      ttl: TWO_MINUTES,
    })

    const [orderCart, cartData] = parallelize(
      useQueryGraphStep({
        entity: "order_cart",
        fields: ["cart_id", "order_id"],
        filters: { cart_id: input.id },
        options: {
          isList: false,
        },
      }),
      useQueryGraphStep({
        entity: "cart",
        fields: completeCartFields,
        filters: { id: input.id },
        options: {
          isList: false,
        },
      }).config({
        name: "cart-query",
      })
    )

    const orderId = transform({ orderCart }, ({ orderCart }) => {
      return orderCart?.data?.order_id
    })

    // this needs to be before the validation step
    const paymentSessions = validateCartPaymentsStep({ cart: cartData.data })
    // purpose of this step is to run compensation if cart completion fails
    // and tries to refund the payment if captured
    compensatePaymentIfNeededStep({
      payment_session_id: paymentSessions[0].id,
    })

    const validate = createHook("validate", {
      input,
      cart: cartData.data,
    })

    // If order ID does not exist, we are completing the cart for the first time
    const order = when("create-order", { orderId }, ({ orderId }) => {
      return !orderId
    }).then(() => {
      const cartOptionIds = transform({ cart: cartData.data }, ({ cart }) => {
        return cart.shipping_methods?.map((sm) => sm.shipping_option_id)
      })

      const shippingOptionsData = useQueryGraphStep({
        entity: "shipping_option",
        fields: ["id", "shipping_profile_id"],
        filters: { id: cartOptionIds },
        options: {
          cache: {
            enable: true,
          },
        },
      }).config({
        name: "shipping-options-query",
      })

      validateShippingStep({
        cart: cartData.data,
        shippingOptions: shippingOptionsData.data,
      })

      const { variants, sales_channel_id } = transform(
        { cart: cartData.data },
        (data) => {
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
        }
      )

      const cartToOrder = transform({ cart: cartData.data }, ({ cart }) => {
        const allItems = (cart.items ?? []).map((item) => {
          const input: PrepareLineItemDataInput = {
            item,
            variant: item.variant,
            cartId: cart.id,
            unitPrice: item.unit_price,
            isTaxInclusive: item.is_tax_inclusive,
            taxLines: item.tax_lines ?? [],
            adjustments: item.adjustments ?? [],
          }

          return prepareLineItemData(input)
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

        const creditLines = (cart.credit_lines ?? []).map(
          (creditLine: CartCreditLineDTO) => {
            return {
              amount: creditLine.amount,
              raw_amount: creditLine.raw_amount,
              reference: creditLine.reference,
              reference_id: creditLine.reference_id,
              metadata: creditLine.metadata,
            }
          }
        )

        const itemAdjustments = allItems
          .map((item) => item.adjustments ?? [])
          .flat(1)
        const shippingAdjustments = shippingMethods
          .map((sm) => sm.adjustments ?? [])
          .flat(1)

        const promoCodes = [...itemAdjustments, ...shippingAdjustments]
          .map((adjustment) => adjustment.code)
          .filter(Boolean)

        const shippingAddress = cart.shipping_address
          ? { ...cart.shipping_address }
          : null
        const billingAddress = cart.billing_address
          ? { ...cart.billing_address }
          : null

        if (shippingAddress) {
          delete shippingAddress.id
        }

        if (billingAddress) {
          delete billingAddress.id
        }

        return {
          region_id: cart.region?.id,
          customer_id: cart.customer?.id,
          sales_channel_id: cart.sales_channel_id,
          status: OrderStatus.PENDING,
          email: cart.email,
          currency_code: cart.currency_code,
          locale: cart.locale,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          no_notification: false,
          items: allItems,
          shipping_methods: shippingMethods,
          metadata: cart.metadata,
          promo_codes: promoCodes,
          credit_lines: creditLines,
        }
      })

      const createdOrders = createOrdersStep([cartToOrder])

      const createdOrder = transform({ createdOrders }, ({ createdOrders }) => {
        return createdOrders[0]
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

      const updateCompletedAt = transform(
        { cart: cartData.data },
        ({ cart }) => {
          return {
            id: cart.id,
            completed_at: new Date(),
          }
        }
      )

      const promotionUsage = transform(
        { cart: cartData.data },
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

          return {
            computedActions: promotionUsage,
            registrationContext: {
              customer_id: cart.customer?.id || null,
              customer_email: cart.email || null,
            },
          }
        }
      )

      const linksToCreate = transform(
        { cart: cartData.data, createdOrder },
        ({ cart, createdOrder }) => {
          const links: LinkDefinition[] = [
            {
              [Modules.ORDER]: { order_id: createdOrder.id },
              [Modules.CART]: { cart_id: cart.id },
            },
          ]

          if (cart.promotions?.length) {
            cart.promotions.forEach((promotion: PromotionDTO) => {
              links.push({
                [Modules.ORDER]: { order_id: createdOrder.id },
                [Modules.PROMOTION]: { promotion_id: promotion.id },
              })
            })
          }

          if (isDefined(cart.payment_collection?.id)) {
            links.push({
              [Modules.ORDER]: { order_id: createdOrder.id },
              [Modules.PAYMENT]: {
                payment_collection_id: cart.payment_collection.id,
              },
            })
          }

          return links
        }
      )

      parallelize(
        createRemoteLinkStep(linksToCreate),
        updateCartsStep([updateCompletedAt]),
        reserveInventoryStep(formatedInventoryItems),
        registerUsageStep(promotionUsage),
        emitEventStep({
          eventName: OrderWorkflowEvents.PLACED,
          data: { id: createdOrder.id },
          options: {
            priority: EventPriority.CRITICAL,
          },
        })
      )

      /**
       * @ignore
       */
      createHook("beforePaymentAuthorization", {
        input,
      })

      // We authorize payment sessions at the very end of the workflow to minimize the risk of
      // canceling the payment in the compensation flow. The only operations that can trigger it
      // is creating the transactions, the workflow hook, and the linking.
      const payment = authorizePaymentSessionStep({
        // We choose the first payment session, as there will only be one active payment session
        // This might change in the future.
        id: paymentSessions![0].id,
      })

      const orderTransactions = transform(
        { payment, createdOrder },
        ({ payment, createdOrder }) => {
          const transactions =
            (payment &&
              payment?.captures?.map((capture) => {
                return {
                  order_id: createdOrder.id,
                  amount: capture.raw_amount ?? capture.amount,
                  currency_code: payment.currency_code,
                  reference: "capture",
                  reference_id: capture.id,
                }
              })) ??
            []

          return transactions
        }
      )

      addOrderTransactionStep(orderTransactions)

      /**
       * @ignore
       */
      createHook("orderCreated", {
        order_id: createdOrder.id,
        cart_id: cartData.data.id,
      })

      return createdOrder
    })

    releaseLockStep({
      key: input.id,
    })

    const result = transform({ order, orderId }, ({ order, orderId }) => {
      return { id: order?.id ?? orderId } as CompleteCartWorkflowOutput
    })

    return new WorkflowResponse(result, {
      hooks: [validate],
    })
  }
)
