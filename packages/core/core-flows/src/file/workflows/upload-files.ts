import { FileDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { uploadFilesStep } from "../steps"

export type UploadFilesWorkflowInput = {
  files: {
    filename: string
    mimeType: string
    content: string
    access: "public" | "private"
  }[]
}

export const uploadFilesWorkflowId = "upload-files"
/**
 * This workflow uploads one or more files.
 */
export const uploadFilesWorkflow = createWorkflow(
  uploadFilesWorkflowId,
  (input: WorkflowData<UploadFilesWorkflowInput>): WorkflowResponse<FileDTO[]> => {
    return new WorkflowResponse(uploadFilesStep(input))
  }
)
