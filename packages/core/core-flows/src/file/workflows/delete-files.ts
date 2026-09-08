import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { deleteFilesStep } from "../steps"

export type DeleteFilesWorkflowInput = { ids: string[] }

export const deleteFilesWorkflowId = "delete-files"
/**
 * This workflow deletes one or more files. It's used by the
 * [Delete File Upload Admin API Route](https://docs.medusajs.com/api/admin/uploads/delete-a-file).
 * 
 * The [File Module Provider](https://docs.medusajs.com/resources/infrastructure-modules/file) installed
 * in your application will be used to delete the file from storage.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete files within your custom flows.
 * 
 * @example
 * const { result } = await deleteFilesWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete files from the database and storage.
 */
export const deleteFilesWorkflow = createWorkflow(
  deleteFilesWorkflowId,
  (input: WorkflowData<DeleteFilesWorkflowInput>): WorkflowData<void> => {
    deleteFilesStep(input.ids)
  }
)
