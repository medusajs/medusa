import {
  ChangeActionType,
  isDefined,
  MedusaError,
  OrderChangeStatus,
  ShippingOptionPriceType,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  ShippingOptionDTO,
} from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
  updateOrderTaxLinesWorkflow,
} from "../../order"
import { createOrderShippingMethods } from "../../order/steps/create-order-shipping-methods"
import { prepareShippingMethod } from "../../order/utils/prepare-shipping-method"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { computeDraftOrderAdjustmentsWorkflow } from "./compute-draft-order-adjustments"
import { getTranslatedShippingOptionsStep } from "../../common/steps/get-translated-shipping-option"

const validateShippingOptionStep = createStep(
  "validate-shipping-option",
  async (data: {
    shippingOptions: ShippingOptionDTO[]
    input: AddDraftOrderShippingMethodsWorkflowInput
  }) => {
    const shippingOption = data.shippingOptions[0]
    const customAmount = data.input.custom_amount

    if (
      shippingOption.price_type === ShippingOptionPriceType.CALCULATED &&
      !isDefined(customAmount)
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Calculated shipping options are not currently supported on draft orders without a custom amount."
      )
    }
  }
)

export const addDraftOrderShippingMethodsWorkflowId =
  "add-draft-order-shipping-methods"

/**
 * The details of the shipping methods to add to a draft order.
 */
export interface AddDraftOrderShippingMethodsWorkflowInput {
  /**
   * The ID of the draft order to add the shipping methods to.
   */
  order_id: string
  /**
   * The ID of the shipping option to add as a shipping method.
   */
  shipping_option_id: string
  /**
   * The custom amount to add the shipping method with.
   * If not specified, the shipping option's fixed or calculated price will be used.
   */
  custom_amount?: BigNumberInput | null
}

/**
 * This workflow adds shipping methods to a draft order. It's used by the
 * [Add Shipping Method to Draft Order Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethods).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around adding shipping methods to
 * a draft order.
 *
 * @example
 * const { result } = await addDraftOrderShippingMethodsWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     shipping_option_id: "so_123",
 *     custom_amount: 10
 *   }
 * })
 *
 * @summary
 *
 * Add shipping methods to a draft order.
 */
export const addDraftOrderShippingMethodsWorkflow = createWorkflow(
  addDraftOrderShippingMethodsWorkflowId,
  function (input: WorkflowData<AddDraftOrderShippingMethodsWorkflowInput>) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO & {
      promotions: {
        code: string
      }[]
    } = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const shippingOptions = useRemoteQueryStep({
      entry_point: "shipping_option",
      fields: [
        "id",
        "name",
        "price_type",
        "calculated_price.calculated_amount",
        "calculated_price.is_calculated_price_tax_inclusive",
      ],
      variables: {
        id: input.shipping_option_id,
        calculated_price: {
          context: { currency_code: order.currency_code },
        },
      },
    }).config({ name: "fetch-shipping-option" })

    const translatedShippingOptions = getTranslatedShippingOptionsStep({
      shippingOptions: shippingOptions,
      locale: order.locale!,
    })

    validateShippingOptionStep({ shippingOptions, input })

    const shippingMethodInput = transform(
      {
        relatedEntity: { order_id: order.id },
        shippingOptions: translatedShippingOptions,
        customPrice: input.custom_amount as any, // Need to cast this to any otherwise the type becomes to complex.
        orderChange,
        input,
      },
      prepareShippingMethod()
    )

    const createdMethods = createOrderShippingMethods({
      shipping_methods: [shippingMethodInput],
    })

    const shippingMethodIds = transform(createdMethods, (createdMethods) => {
      return createdMethods.map((item) => item.id)
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        shipping_method_ids: shippingMethodIds,
      },
    })

    const orderChangeActionInput = transform(
      {
        order,
        shippingOptions,
        createdMethods,
        customPrice: input.custom_amount as any, // Need to cast this to any otherwise the type becomes too complex.
        orderChange,
      },
      ({
        shippingOptions,
        order,
        createdMethods,
        customPrice,
        orderChange,
      }) => {
        const shippingOption = shippingOptions[0]
        const createdMethod = createdMethods[0]
        const methodPrice =
          customPrice ?? shippingOption.calculated_price.calculated_amount

        return {
          action: ChangeActionType.SHIPPING_ADD,
          reference: "order_shipping_method",
          order_change_id: orderChange.id,
          reference_id: createdMethod.id,
          amount: methodPrice,
          order_id: order.id,
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput],
    })

    const appliedPromoCodes: string[] = transform(
      order,
      (order) => order.promotions?.map((promotion) => promotion.code) ?? []
    )

    // If any the order has any promo codes, then we need to refresh the adjustments.
    when(
      appliedPromoCodes,
      (appliedPromoCodes) => appliedPromoCodes.length > 0
    ).then(() => {
      computeDraftOrderAdjustmentsWorkflow.runAsStep({
        input: {
          order_id: input.order_id,
        },
      })
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
