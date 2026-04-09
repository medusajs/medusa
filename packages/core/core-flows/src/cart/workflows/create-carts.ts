import {
  AdditionalData,
  ConfirmVariantInventoryWorkflowInputDTO,
  CreateCartDTO,
  CreateCartWorkflowInputDTO,
  CreateLineItemDTO,
} from "@medusajs/framework/types"
import {
  CartWorkflowEvents,
  deduplicate,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  createHook,
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common/steps/emit-event"
import {
  createCartsStep,
  findOneOrAnyRegionStep,
  findOrCreateCustomerStep,
  findSalesChannelStep,
} from "../steps"
import { validateSalesChannelStep } from "../steps/validate-sales-channel"
import { productVariantsFields } from "../utils/fields"
import { requiredVariantFieldsForInventoryConfirmation } from "../utils/prepare-confirm-inventory-input"
import { pricingContextResult } from "../utils/schemas"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"
import { getVariantsAndItemsWithPrices } from "./get-variants-and-items-with-prices"
import { refreshPaymentCollectionForCartWorkflow } from "./refresh-payment-collection"
import { updateCartPromotionsWorkflow } from "./update-cart-promotions"
import { updateTaxLinesWorkflow } from "./update-tax-lines"
import { getTranslatedLineItemsStep } from "../../common"

/**
 * The data to create the cart, along with custom data that's passed to the workflow's hooks.
 */
export type CreateCartWorkflowInput = CreateCartWorkflowInputDTO &
  AdditionalData

export const createCartWorkflowId = "create-cart"
/**
 * This workflow creates and returns a cart. You can set the cart's items, region, customer, and other details. This workflow is executed by the
 * [Create Cart Store API Route](https://docs.medusajs.com/api/store#carts_postcarts).
 *
 * This workflow has a hook that allows you to perform custom actions on the created cart. You can see an example in [this guide](https://docs.medusajs.com/resources/commerce-modules/cart/extend#step-4-consume-cartcreated-workflow-hook).
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around cart creation.
 *
 * @example
 * const { result } = await createCartWorkflow(container)
 *   .run({
 *     input: {
 *       region_id: "reg_123",
 *       items: [
 *         {
 *           variant_id: "var_123",
 *           quantity: 1,
 *         }
 *       ],
 *       customer_id: "cus_123",
 *       additional_data: {
 *         external_id: "123"
 *       }
 *     }
 *   })
 *
 * @summary
 *
 * Create a cart specifying region, items, and more.
 *
 * @property hooks.validate - This hook is executed before all operations. You can consume this hook to perform any custom validation. If validation fails, you can throw an error to stop the workflow execution.
 * @property hooks.cartCreated - This hook is executed after a cart is created. You can consume this hook to perform custom actions on the created cart.
 * @property hooks.setPricingContext - This hook is executed after the cart is retrieved and before the line items are created. You can consume this hook to return any custom context useful for the prices retrieval of the variants to be added to the cart.
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
 * import { createCartWorkflow } from "@medusajs/medusa/core-flows";
 * import { StepResponse } from "@medusajs/workflows-sdk";
 *
 * createCartWorkflow.hooks.setPricingContext((
 *   { region, variantIds, salesChannel, customerData, additional_data }, { container }
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
export const createCartWorkflow = createWorkflow(
  createCartWorkflowId,
  (input: WorkflowData<CreateCartWorkflowInput>) => {
    const variantIds = transform({ input }, (data) => {
      return (data.input.items ?? [])
        .map((i) => i.variant_id)
        .filter((v): v is string => !!v)
    })

    const [salesChannel, region, customerData] = parallelize(
      findSalesChannelStep({
        salesChannelId: input.sales_channel_id,
      }),
      findOneOrAnyRegionStep({
        regionId: input.region_id,
      }),
      findOrCreateCustomerStep({
        customerId: input.customer_id,
        email: input.email,
      })
    )

    validateSalesChannelStep({ salesChannel })
    const setPricingContext = createHook(
      "setPricingContext",
      {
        region,
        variantIds,
        salesChannel,
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
        cart: {
          currency_code: input.currency_code,
          region,
          region_id: region.id,
          customer_id: customerData.customer?.id,
        },
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

    const cartInput = transform(
      { input, region, customerData, salesChannel },
      (data) => {
        if (!data.region) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "No regions found")
        }

        const data_ = {
          ...data.input,
          currency_code: data.input.currency_code ?? data.region.currency_code,
          region_id: data.region.id,
        }

        if (data.customerData.customer?.id) {
          data_.customer_id = data.customerData.customer.id
          data_.email = data.input?.email ?? data.customerData.customer.email
        }

        data_.sales_channel_id = data.salesChannel!.id

        // If there is only one country in the region, we prepare a shipping address with that country's code.
        if (
          !data.input.shipping_address &&
          data.region.countries.length === 1
        ) {
          data_.shipping_address = {
            country_code: data.region.countries[0].iso_2,
          }
        }

        return data_ as CreateCartDTO
      }
    )

    const itemsToCreate = transform({ lineItems }, (data) => {
      return data.lineItems.map((i) => i.data as CreateLineItemDTO)
    })

    const translatedItems = getTranslatedLineItemsStep({
      items: itemsToCreate,
      variants,
      locale: input.locale,
    })

    const cartToCreate = transform(
      { cartInput, translatedItems } as unknown as {
        cartInput: CreateCartDTO
        translatedItems: CreateLineItemDTO[]
      },
      (data) => {
        data.cartInput.items = data.translatedItems
        return data.cartInput as unknown as CreateCartDTO
      }
    )

    const validate = createHook("validate", {
      input: cartInput,
      cart: cartToCreate,
    })

    const carts = createCartsStep([cartToCreate])
    const cart = transform({ carts }, (data) => data.carts?.[0])

    updateTaxLinesWorkflow.runAsStep({
      input: {
        cart_id: cart.id,
      },
    })

    updateCartPromotionsWorkflow.runAsStep({
      input: {
        cart_id: cart.id,
        promo_codes: input.promo_codes,
        force_refresh_payment_collection: false,
      },
    })

    parallelize(
      refreshPaymentCollectionForCartWorkflow.runAsStep({
        input: {
          cart: cart,
        },
      }),
      emitEventStep({
        eventName: CartWorkflowEvents.CREATED,
        data: { id: cart.id },
      })
    )

    const cartCreated = createHook("cartCreated", {
      cart,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(cart, {
      hooks: [validate, cartCreated, setPricingContext] as const,
    })
  }
)
