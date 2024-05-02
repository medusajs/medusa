import { CompleteCartWorkflowInputDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

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
  (input: WorkflowData<CompleteCartWorkflowInputDTO>): WorkflowData<void> => {}
)
