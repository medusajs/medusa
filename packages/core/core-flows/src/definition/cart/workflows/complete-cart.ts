import { OrderDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderFromCartStep } from "../steps"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { completeCartFields } from "../utils/fields"
import { confirmVariantInventoryWorkflow } from "./confirm-variant-inventory"

/*
  - [] Create Tax Lines
  - [] Authorize Payment
    - fail:
      - [] Delete Tax lines
  - [] Reserve Item from inventory (if enabled)
    - fail:
      - [] Delete reservations
      - [] Cancel Payment
  - [] Create order
*/
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

    const { variants, items, sales_channel_id } = transform(
      { cart },
      (data) => {
        const allItems: any[] = []
        const allVariants: any[] = []
        data.cart.items.forEach((item) => {
          allItems.push({
            id: item.id,
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

    confirmVariantInventoryWorkflow.runAsStep({
      input: {
        ignore_price_check: true,
        sales_channel_id,
        variants,
        items,
      },
    })

    updateTaxLinesStep({ cart_or_cart_id: cart, force_tax_calculation: true })

    const finalCart = useRemoteQueryStep({
      entry_point: "cart",
      fields: completeCartFields,
      variables: { id: input.id },
      list: false,
    }).config({ name: "final-cart" })

    return createOrderFromCartStep({ cart: finalCart })
  }
)
