import {
  AdditionalData,
  ConfirmVariantInventoryWorkflowInputDTO,
  CreateOrderLineItemDTO,
  OrderLineItemDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { deduplicate } from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { findOneOrAnyRegionStep } from "../../cart/steps/find-one-or-any-region"
import { findOrCreateCustomerStep } from "../../cart/steps/find-or-create-customer"
import { findSalesChannelStep } from "../../cart/steps/find-sales-channel"
import { requiredVariantFieldsForInventoryConfirmation } from "../../cart/utils/prepare-confirm-inventory-input"
import { pricingContextResult } from "../../cart/utils/schemas"
import { confirmVariantInventoryWorkflow } from "../../cart/workflows/confirm-variant-inventory"
import { getVariantsAndItemsWithPrices } from "../../cart/workflows/get-variants-and-items-with-prices"
import { getTranslatedLineItemsStep, useQueryGraphStep } from "../../common"
import { createOrderLineItemsStep } from "../steps"
import { productVariantsFields } from "../utils/fields"

/**
 * The created order line items.
 */
export type OrderAddLineItemWorkflowOutput = OrderLineItemDTO[]

export const addOrderLineItemsWorkflowId = "order-add-line-items"
/**
 * This workflow adds line items to an order. This is useful when making edits to
 * an order. It's used by other workflows, such as {@link orderEditAddNewItemWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around adding items to
 * an order.
 *
 * @example
 * const { result } = await addOrderLineItemsWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     items: [
 *       {
 *         variant_id: "variant_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Add line items to an order.
 *
 * @property hooks.setPricingContext - This hook is executed after the order is retrieved and before the line items are created. You can consume this hook to return any custom context useful for the prices retrieval of the variants to be added to the order.
 *
 * For example, assuming you have the following custom pricing rule:
 *
 * ```json
 * {
 *   "attribute": "location_id",
 *   "operator": "eq",
 *   "value": "sloc_123",
 * }
 * ```
 *
 * You can consume the `setPricingContext` hook to add the `location_id` context to the prices calculation:
 *
 * ```ts
 * import { addOrderLineItemsWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * addOrderLineItemsWorkflow.hooks.setPricingContext((
 *   { order, variantIds, region, customerData, additional_data }, { container }
 * ) => {
 *   return new StepResponse({
 *     location_id: "sloc_123", // Special price for in-store purchases
 *   });
 * });
 * ```
 *
 * The variants' prices will now be retrieved using the context you return.
 *
 * :::note
 *
 * Learn more about prices calculation context in the [Prices Calculation](https://docs.medusajs.com/resources/commerce-modules/pricing/price-calculation) documentation.
 *
 * :::
 */
export const addOrderLineItemsWorkflow = createWorkflow(
  addOrderLineItemsWorkflowId,
  (
    input: WorkflowData<
      OrderWorkflow.OrderAddLineItemWorkflowInput & AdditionalData
    >
  ) => {
    const { data: order } = useQueryGraphStep({
      entity: "order",
      filters: { id: input.order_id },
      fields: [
        "id",
        "sales_channel_id",
        "region_id",
        "customer_id",
        "email",
        "currency_code",
        "locale",
      ],
      options: { throwIfKeyNotFound: true, isList: false },
    }).config({ name: "order-query" })

    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? [])
        .map((item) => item.variant_id)
        .filter(Boolean) as string[]
    })

    const [salesChannel, region, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: order.sales_channel_id,
      }),
      findOneOrAnyRegionStep({
        regionId: order.region_id,
      }),
      findOrCreateCustomerStep({
        customerId: order.customer_id,
        email: order.email,
      })
    )

    const setPricingContext = createHook(
      "setPricingContext",
      {
        order,
        variantIds,
        region,
        customerData,
        additional_data: input.additional_data,
      },
      {
        resultValidator: pricingContextResult,
      }
    )
    const setPricingContextResult = setPricingContext.getResult()

    const { variants, lineItems } = getVariantsAndItemsWithPrices.runAsStep({
      input: {
        cart: order,
        items: input.items,
        setPricingContextResult: setPricingContextResult!,
        variants: {
          id: variantIds,
          fields: deduplicate([
            ...productVariantsFields,
            ...requiredVariantFieldsForInventoryConfirmation,
          ]),
        },
      },
    })

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id: salesChannel.id,
        variants:
          variants as unknown as ConfirmVariantInventoryWorkflowInputDTO["variants"],
        items: input.items!,
      },
    })

    const items = transform({ lineItems }, (data) => {
      return data.lineItems.map((item) => {
        return item.data as CreateOrderLineItemDTO
      })
    })

    const translatedItems = getTranslatedLineItemsStep({
      items,
      variants,
      locale: order.locale,
    })

    return new WorkflowResponse(
      createOrderLineItemsStep({
        items: translatedItems,
      }) satisfies OrderAddLineItemWorkflowOutput,
      {
        hooks: [setPricingContext] as const,
      }
    )
  }
)
