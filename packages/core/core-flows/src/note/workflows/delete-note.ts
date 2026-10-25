import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteNoteStep } from "../steps"

/**
 * The data to delete a note.
 */
export type DeleteNoteWorkflowInput = {
  /**
   * The ID of the note to delete.
   */
  id: string
}

export const deleteNoteWorkflowId = "delete-note"
/**
 * This workflow deletes a note. It's used by the
 * Delete Note Admin API Route.
 *
 * You can also use this workflow within your own custom workflows, allowing you to wrap custom logic around note deletion.
 *
 * @example
 * await deleteNoteWorkflow(container)
 * .run({
 *   input: {
 *     id: "note_123"
 *   }
 * })
 *
 * @summary
 *
 * Delete a note.
 */
export const deleteNoteWorkflow = createWorkflow(
  deleteNoteWorkflowId,
  (input: WorkflowData<DeleteNoteWorkflowInput>) => {
    return new WorkflowResponse(deleteNoteStep(input.id))
  }
)
