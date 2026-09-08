import { CartWorkflowEvents } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { AdditionalData } from "@medusajs/types"
import { emitEventStep, useQueryGraphStep } from "../../common"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { updateCartsStep } from "../steps"
import { refreshCartItemsWorkflow } from "./refresh-cart-items"

/**
 * The cart ownership transfer details.
 */
export type TransferCartCustomerWorkflowInput = {
  /**
   * The cart's ID.
   */
  id: string
  /**
   * The ID of the customer to transfer the cart to.
   */
  customer_id: string
}

export const transferCartCustomerWorkflowId = "transfer-cart-customer"
/**
 * This workflow transfers a cart's customer ownership to another customer. It's useful if a customer logs in after
 * adding the items to their cart, allowing you to transfer the cart's ownership to the logged-in customer. This workflow is used
 * by the [Set Cart's Customer Store API Route](https://docs.medusajs.com/api/store/carts/change-customer).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to set the cart's customer within your custom flows.
 *
 * @example
 * const { result } = await transferCartCustomerWorkflow(container)
 * .run({
 *   input: {
 *     id: "cart_123",
 *     customer_id: "cus_123"
 *   }
 * })
 *
 * @summary
 *
 * Refresh a cart's payment collection details.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 */
export const transferCartCustomerWorkflow = createWorkflow(
  {
    name: transferCartCustomerWorkflowId,
    idempotent: false,
  },
  (input: WorkflowData<TransferCartCustomerWorkflowInput & AdditionalData>) => {
    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.id },
      fields: [
        "id",
        "email",
        "customer_id",
        "customer.has_account",
        "shipping_address.*",
        "region.*",
        "region.countries.*",
      ],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-cart" })

    const cart = transform({ cartQuery }, ({ cartQuery }) => cartQuery.data[0])

    const validate = createHook("validate", {
      input,
      cart,
    })

    const customerQuery = useQueryGraphStep({
      entity: "customer",
      filters: { id: input.customer_id },
      fields: ["id", "email"],
      options: {
        throwIfKeyNotFound: true,
        isList: false,
        cache: { enable: true },
      },
    }).config({ name: "get-customer" })

    const customer = transform(
      { customerQuery },
      ({ customerQuery }) => customerQuery.data
    )

    // If its the same customer, we don't want the email to be overridden, so we skip the
    // update entirely. When the customer is different, we also override the email.
    // The customer will have an opportunity to edit email again through update cart endpoint.
    const shouldTransfer = transform(
      { cart, customer },
      ({ cart, customer }) => cart.customer?.id !== customer.id
    )

    when(
      "should-transfer-cart",
      { shouldTransfer },
      ({ shouldTransfer }) => shouldTransfer
    ).then(() => {
      acquireLockStep({
        key: cart.id,
        timeout: 2,
        ttl: 10,
      })

      const cartInput = transform({ cart, customer }, ({ cart, customer }) => [
        {
          id: cart.id,
          customer_id: customer.id,
          email: customer.email,
        },
      ])

      updateCartsStep(cartInput)

      refreshCartItemsWorkflow.runAsStep({
        input: {
          cart_id: input.id,
          force_refresh: true,
          additional_data: input.additional_data,
        },
      })

      parallelize(
        emitEventStep({
          eventName: CartWorkflowEvents.CUSTOMER_TRANSFERRED,
          data: {
            id: input.id,
            customer_id: customer.customer_id,
          },
        }),
        releaseLockStep({
          key: cart.id,
        })
      )
    })

    return new WorkflowResponse(void 0, {
      hooks: [validate],
    })
  }
)
