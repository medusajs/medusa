import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus, isDefined } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  updateOrderChangeActionsStep,
  updateOrderShippingMethodsStep,
} from "../../steps"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * This step validates that a claim's shipping method can be updated.
 */
export const updateClaimShippingMethodValidationStep = createStep(
  "validate-update-claim-shipping-method",
  async function ({
    orderChange,
    orderClaim,
    input,
  }: {
    input: { claim_id: string; action_id: string }
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No shipping method found for claim ${input.claim_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.SHIPPING_ADD) {
      throw new Error(
        `Action ${associatedAction.id} is not adding a shipping method`
      )
    }
  }
)

export const updateClaimShippingMethodWorkflowId =
  "update-claim-shipping-method"
/**
 * This workflow updates a claim's shipping method.
 */
export const updateClaimShippingMethodWorkflow = createWorkflow(
  updateClaimShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateClaimShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: [
        "id",
        "status",
        "order_id",
        "canceled_at",
        "order.currency_code",
      ],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    const shippingOptions = when(
      { input, orderClaim },
      ({ input, orderClaim }) => {
        return input.data?.custom_price === null
      }
    ).then(() => {
      const action = transform(
        { orderChange, input },
        ({ orderChange, input }) => {
          const originalAction = (orderChange.actions ?? []).find(
            (a) => a.id === input.action_id
          ) as OrderChangeActionDTO

          return {
            shipping_method_id: originalAction.reference_id,
            currency_code: (orderClaim as any).order.currency_code,
          }
        }
      )

      const shippingMethod = useRemoteQueryStep({
        entry_point: "order_shipping_method",
        fields: ["id", "shipping_option_id"],
        variables: {
          id: action.shipping_method_id,
        },
        list: false,
      }).config({ name: "fetch-shipping-method" })

      return useRemoteQueryStep({
        entry_point: "shipping_option",
        fields: [
          "id",
          "name",
          "calculated_price.calculated_amount",
          "calculated_price.is_calculated_price_tax_inclusive",
        ],
        variables: {
          id: shippingMethod.shipping_option_id,
          calculated_price: {
            context: { currency_code: action.currency_code },
          },
        },
      }).config({ name: "fetch-shipping-option" })
    })

    updateClaimShippingMethodValidationStep({ orderClaim, orderChange, input })

    const updateData = transform(
      { orderChange, input, shippingOptions },
      ({ input, orderChange, shippingOptions }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data
        const option = shippingOptions[0]

        const action = {
          id: originalAction.id,
          amount: data.custom_price,
          internal_note: data.internal_note,
        }

        const isCustomPrice = !isDefined(shippingOptions)
        const shippingMethod = {
          id: originalAction.reference_id,
          amount: isCustomPrice
            ? data.custom_price
            : option.calculated_price.calculated_amount,
          is_custom_amount: isCustomPrice,
          metadata: data.metadata,
        }

        return {
          action,
          shippingMethod,
        }
      }
    )

    parallelize(
      updateOrderChangeActionsStep([updateData.action]),
      updateOrderShippingMethodsStep([updateData.shippingMethod!])
    )

    return new WorkflowResponse(previewOrderChangeStep(orderClaim.order_id))
  }
)
