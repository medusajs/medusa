import { CompleteCartWorkflowInputDTO, OrderDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderFromCartWorkflow } from "../steps"
import { updateTaxLinesStep } from "../steps/update-tax-lines"
import { completeCartFields } from "../utils/fields"

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
  (
    input: WorkflowData<CompleteCartWorkflowInputDTO>
  ): WorkflowData<OrderDTO> => {
    const cart = useRemoteQueryStep({
      entry_point: "cart",
      fields: completeCartFields,
      variables: { id: input.id },
      list: false,
    })

    updateTaxLinesStep({ cart_or_cart_id: cart, force_tax_calculation: true })

    return createOrderFromCartWorkflow({ cart })
  }
)
