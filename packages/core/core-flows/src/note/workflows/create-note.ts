import type { CreateNoteDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createNoteStep } from "../steps"

export const createNoteWorkflowId = "create-note"
/**
 * This workflow creates a note. It's used by the
 * Create Note Admin API Route.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around note creation.
 *
 * @example
 * const { result } = await createNoteWorkflow(container)
 * .run({
 *   input: {
 *     resource_type: "order",
 *     resource_id: "order_123",
 *     value: "Called customer",
 *     author_id: "user_123"
 *   }
 * })
 *
 * @summary
 *
 * Create a note.
 */
export const createNoteWorkflow = createWorkflow(
  createNoteWorkflowId,
  (input: WorkflowData<CreateNoteDTO>) => {
    const note = createNoteStep(input)

    return new WorkflowResponse(note)
  }
)
