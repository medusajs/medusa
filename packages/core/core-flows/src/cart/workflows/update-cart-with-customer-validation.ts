import {
  AdditionalData,
  UpdateCartWorkflowInputDTO,
} from "@medusajs/framework/types"
import { isDefined, isPresent, MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { updateCartWorkflow } from "./update-cart"

/**
 * This step validates rules of engagement when customer_id or email is
 * requested to be updated.
 */
export const validateCartCustomerOrEmailStep = createStep(
  "validate-cart-customer-or-email",
  async function ({
    input,
    cart,
  }: {
    input: {
      customer_id?: string | null
      email?: string | null
      auth_customer_id: string | undefined | null
    }
    cart: { customer_id: string | null; email: string | null }
  }) {
    if (isPresent(cart.customer_id) && cart.customer_id !== input.customer_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot update cart customer when customer_id is set`
      )
    }

    if (isDefined(input.customer_id) && !isDefined(input.auth_customer_id)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `auth_customer_id is required when customer_id is set`
      )
    }

    const isInputCustomerIdDifferent =
      input.auth_customer_id !== input.customer_id

    if (isDefined(input.customer_id) && isInputCustomerIdDifferent) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot update cart customer_id to a different customer`
      )
    }
  }
)

export const updateCartWorkflowWithCustomerValidationId =
  "update-cart-with-customer-validation"
/**
 * This workflow wraps updateCartWorkflow with customer validations
 */
export const updateCartWorkflowWithCustomerValidation = createWorkflow(
  updateCartWorkflowWithCustomerValidationId,
  (
    input: WorkflowData<
      UpdateCartWorkflowInputDTO &
        AdditionalData & { auth_customer_id: string | undefined }
    >
  ) => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      variables: { id: input.id },
      fields: ["id", "customer_id", "email"],
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "get-cart" })

    when({ input }, ({ input }) => {
      return !!input.customer_id || !!input.email
    }).then(() => {
      validateCartCustomerOrEmailStep({ input, cart })
    })

    const updatedCart = updateCartWorkflow.runAsStep({ input })

    return new WorkflowResponse(updatedCart)
  }
)
