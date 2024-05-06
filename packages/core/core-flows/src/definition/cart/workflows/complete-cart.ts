import { OrderDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { authorizePaymentSessionStep } from "../../../payment/steps/authorize-payment-session"
import { createOrderFromCartStep, validateCartPaymentsStep } from "../steps"
import { reserveInventoryStep } from "../steps/reserve-inventory"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { completeCartFields } from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"

export const completeCartWorkflowId = "complete-cart"
export const completeCartWorkflow = createWorkflow(
  completeCartWorkflowId,
  (input: WorkflowData<any>): WorkflowData<OrderDTO> => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: completeCartFields,
      variables: { id: input.id },
      list: false,
    })

    const paymentSession = validateCartPaymentsStep({ cart })

    // Question: While running cart complete, we seem to assume that the payment collection is already created.
    // The payment collection amount should already have the tax amount, why are we updating the tax lines here?
    updateTaxLinesStep({ cart_or_cart_id: cart, force_tax_calculation: true })

    authorizePaymentSessionStep({
      id: paymentSession.id,
      context: { cart_id: cart.id },
    })

    const { variants, items, sales_channel_id } = transform(
      { cart },
      (data) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        data.cart.items.forEach((item) => {
          allItems.push({
            id: item.id,
            variant_id: item.variant_id,
            quantity: item.quantity,
          })
          allVariants.push(item.variant)
        })

        return {
          variants: allVariants,
          items: allItems,
          sales_channel_id: data.cart.sales_channel_id,
        }
      }
    )

    const formatedInventoryItems = confirmVariantInventoryWorkflow.runAsStep({
      input: {
        sales_channel_id,
        variants,
        items,
      },
    })

    reserveInventoryStep(formatedInventoryItems)

    const finalCart = useRemoteQueryStep({
      entry_point: "cart",
      fields: completeCartFields,
      variables: { id: input.id },
      list: false,
    }).config({ name: "final-cart" })

    return createOrderFromCartStep({ cart: finalCart })
  }
)
