import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { WorkflowTypes } from "@medusajs/types"

export const exportProductsWorkflowId = "export-products"
export const exportProductsWorkflow = createWorkflow(
  exportProductsWorkflowId,
  (
    input: WorkflowData<WorkflowTypes.ProductWorkflow.ExportProductsDTO>
  ): WorkflowData<void> => {
    const products = useRemoteQueryStep({
      entry_point: "product",
      fields: input.select,
      variables: input.filter,
      list: true,
    })
  }
)
