import { FileDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { uploadFilesStep } from "../steps"

type WorkflowInput = {
  files: {
    filename: string
    mimeType: string
    content: string
    access: "public" | "private"
  }[]
}

export const uploadFilesWorkflowId = "upload-files"
export const uploadFilesWorkflow = createWorkflow(
  uploadFilesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<FileDTO[]>> => {
    return new WorkflowResponse(uploadFilesStep(input))
  }
)
