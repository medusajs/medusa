import type { OrderDTO, OrderWorkflow } from "@medusajs/framework/types"
import {
  OrderPreviewDTO,
  RegisterOrderChangeDTO,
  UpdateOrderDTO,
} from "@medusajs/framework/types"
import {
  MedusaError,
  OrderWorkflowEvents,
  validateEmail,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"

import { emitEventStep, useQueryGraphStep } from "../../common"
import {
  previewOrderChangeStep,
  registerOrderChangesStep,
  updateOrderItemsTranslationsStep,
  updateOrderShippingMethodsTranslationsStep,
  updateOrdersStep,
} from "../steps"
import { throwIfOrderIsCancelled } from "../utils/order-validation"
import { findOrCreateCustomerStep } from "../../cart"
import { updateOrderTaxLinesTranslationsStep } from "../steps/update-order-tax-lines-translations"

/**
 * The data to validate the order update.
 */
export type UpdateOrderValidationStepInput = {
  /**
   * The order to validate the update for.
   */
  order: OrderDTO
  /**
   * The order update details.
   */
  input: OrderWorkflow.UpdateOrderWorkflowInput
}

/**
 * This step validates that an order can be updated with provided input. If the order is cancelled,
 * the email is invalid, or the country code is being changed in the shipping or billing addresses, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = updateOrderValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   input: {
 *     id: "order_123",
 *     user_id: "user_123"
 *   }
 * })
 */
export const updateOrderValidationStep = createStep(
  "update-order-validation",
  async function ({ order, input }: UpdateOrderValidationStepInput) {
    throwIfOrderIsCancelled({ order })

    if (
      input.shipping_address?.country_code &&
      order.shipping_address?.country_code !==
        input.shipping_address?.country_code
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Country code cannot be changed"
      )
    }

    if (
      input.billing_address?.country_code &&
      order.billing_address?.country_code !==
        input.billing_address?.country_code
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Country code cannot be changed"
      )
    }

    if (input.email) {
      validateEmail(input.email)
    }
  }
)

export const updateOrderWorkflowId = "update-order-workflow"
/**
 * This workflow updates an order's general details, such as its email or addresses. It's used by the
 * [Update Order Admin API Route](https://docs.medusajs.com/api/admin#orders_postordersid).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to update an
 * order's details in your custom flows.
 *
 * @example
 * const { result } = await updateOrderWorkflow(container)
 * .run({
 *   input: {
 *     id: "order_123",
 *     user_id: "user_123",
 *     email: "example@gmail.com",
 *   }
 * })
 *
 * @summary
 *
 * Update an order's details.
 */
export const updateOrderWorkflow = createWorkflow(
  updateOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateOrderWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderQuery = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "status",
        "email",
        "locale",
        "shipping_address.*",
        "billing_address.*",
        "metadata",
        "shipping_methods.id",
        "shipping_methods.name",
        "shipping_methods.shipping_option_id",
      ],
      filters: { id: input.id },
      options: { throwIfKeyNotFound: true },
    }).config({ name: "order-query" })

    const order = transform(
      { orderQuery },
      ({ orderQuery }) => orderQuery.data[0]
    )

    updateOrderValidationStep({ order, input })

    const customerData = when({ input, order }, ({ input, order }) => {
      return !order.email && !!input.email
    }).then(() => {
      return findOrCreateCustomerStep({ email: input.email })
    })

    const updateInput = transform(
      { input, order, customerData },
      ({ input, order, customerData }) => {
        const update: UpdateOrderDTO = {}

        if (input.shipping_address) {
          const address = {
            // we want to create a new address
            ...order.shipping_address,
            ...input.shipping_address,
          }
          delete address.id
          update.shipping_address = address
        }

        if (input.billing_address) {
          const address = {
            ...order.billing_address,
            ...input.billing_address,
          }
          delete address.id
          update.billing_address = address
        }

        if (!!customerData?.customer) {
          update.customer_id = customerData.customer.id
        }

        return { ...input, ...update }
      }
    )

    const updatedOrders = updateOrdersStep({
      selector: { id: input.id },
      update: updateInput,
    })

    const orderChangeInput = transform(
      { input, updatedOrders, order },
      ({ input, updatedOrders, order }) => {
        const updatedOrder = updatedOrders[0]

        const changes: RegisterOrderChangeDTO[] = []
        if (input.shipping_address) {
          changes.push({
            change_type: "update_order" as const,
            order_id: input.id,
            created_by: input.user_id,
            confirmed_by: input.user_id,
            details: {
              type: "shipping_address",
              old: order.shipping_address,
              new: updatedOrder.shipping_address,
            },
          })
        }

        if (input.billing_address) {
          changes.push({
            change_type: "update_order" as const,
            order_id: input.id,
            created_by: input.user_id,
            confirmed_by: input.user_id,
            details: {
              type: "billing_address",
              old: order.billing_address,
              new: updatedOrder.billing_address,
            },
          })
        }

        if (input.email) {
          changes.push({
            change_type: "update_order" as const,
            order_id: input.id,
            created_by: input.user_id,
            confirmed_by: input.user_id,
            details: {
              type: "email",
              old: order.email,
              new: input.email,
            },
          })
        }

        if (input.metadata !== undefined) {
          changes.push({
            change_type: "update_order" as const,
            order_id: input.id,
            created_by: input.user_id,
            confirmed_by: input.user_id,
            details: {
              type: "metadata",
              old: order.metadata,
              new: input.metadata,
            },
          })
        }

        if (!!input.locale && input.locale !== order.locale) {
          changes.push({
            change_type: "update_order" as const,
            order_id: input.id,
            created_by: input.user_id,
            confirmed_by: input.user_id,
            details: {
              type: "locale",
              old: order.locale,
              new: input.locale,
            },
          })
        }

        return changes
      }
    )

    registerOrderChangesStep(orderChangeInput)

    when("locale-changed", { input, order }, ({ input, order }) => {
      return !!input.locale && input.locale !== order.locale
    }).then(() => {
      parallelize(
        updateOrderItemsTranslationsStep({
          order_id: input.id,
          locale: input.locale!,
        }),
        updateOrderShippingMethodsTranslationsStep({
          locale: input.locale!,
          shippingMethods: order.shipping_methods,
        }),
        updateOrderTaxLinesTranslationsStep({
          order_id: input.id,
          locale: input.locale!,
        })
      )
    })

    emitEventStep({
      eventName: OrderWorkflowEvents.UPDATED,
      data: { id: input.id },
    })

    return new WorkflowResponse(previewOrderChangeStep(input.id))
  }
)
