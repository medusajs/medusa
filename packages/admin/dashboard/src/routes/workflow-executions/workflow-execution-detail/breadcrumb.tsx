import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"

import { useWorkflowExecution } from "../../../hooks/api"

type WorkflowExecutionDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminWorkflowExecutionResponse>

export const WorkflowExecutionDetailBreadcrumb = (
  props: WorkflowExecutionDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { workflow_execution } = useWorkflowExecution(id!, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!workflow_execution) {
    return null
  }

  const cleanId = workflow_execution.id.replace("wf_exec_", "")

  return <span>{cleanId}</span>
}
