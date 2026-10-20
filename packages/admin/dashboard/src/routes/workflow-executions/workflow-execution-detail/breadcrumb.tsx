import { HttpTypes } from "@medusajs/types"
import { UIMatch } from "react-router-dom"

import { useWorkflowExecution } from "../../../hooks/api"

type WorkflowExecutionDetailBreadcrumbProps =
  UIMatch<HttpTypes.AdminWorkflowExecutionResponse>

export const WorkflowExecutionDetailBreadcrumb = (
  props: WorkflowExecutionDetailBreadcrumbProps
) => {
  const { id } = props.params || {}

  const { workflow_execution } = useWorkflowExecution(id!, {
    initialData: props.loaderData,
    enabled: Boolean(id),
  })

  if (!workflow_execution) {
    return null
  }

  return <span>{workflow_execution.id}</span>
}

export const seo = (
  match: UIMatch<HttpTypes.AdminWorkflowExecutionResponse>
) => ({
  title: match.loaderData?.workflow_execution?.id,
})
