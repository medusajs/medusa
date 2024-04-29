import { FileDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { uploadFilesStep } from "../steps"

type WorkflowInput = {
  files: {
    filename: string
    mimeType: string
    content: string
  }[]
}

export const uploadFilesWorkflowId = "upload-files"
export const uploadFilesWorkflow = createWorkflow(
  uploadFilesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<FileDTO[]> => {
    return uploadFilesStep(input)
  }
)
