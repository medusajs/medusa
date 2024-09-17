import { LocalWorkflow } from "@medusajs/orchestration"
import { LoadedModule, MedusaContainer } from "@medusajs/types"
import { ExportedWorkflow } from "./helper"

class MedusaWorkflow {
  static workflows: Record<
    string,
    (
      container?: LoadedModule[] | MedusaContainer
    ) => Omit<
      LocalWorkflow,
      "run" | "registerStepSuccess" | "registerStepFailure" | "cancel"
    > &
      ExportedWorkflow
  > = {}

  static registerWorkflow(workflowId, exportedWorkflow) {
    if (workflowId in MedusaWorkflow.workflows) {
      return
    }

    MedusaWorkflow.workflows[workflowId] = exportedWorkflow
  }

  static getWorkflow(workflowId): ExportedWorkflow {
    return MedusaWorkflow.workflows[workflowId] as unknown as ExportedWorkflow
  }
}

global.MedusaWorkflow ??= MedusaWorkflow
const GlobalMedusaWorkflow = global.MedusaWorkflow

export { GlobalMedusaWorkflow as MedusaWorkflow }
