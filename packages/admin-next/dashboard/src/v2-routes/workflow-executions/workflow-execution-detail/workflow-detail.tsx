import { useParams } from "react-router-dom"

import { JsonViewSection } from "../../../components/common/json-view-section"
import { useWorkflowExecution } from "../../../hooks/api/workflow-executions"
import { WorkflowExecutionGeneralSection } from "./components/workflow-execution-general-section"
import { WorkflowExecutionHistorySection } from "./components/workflow-execution-history-section"
import { WorkflowExecutionPayloadSection } from "./components/workflow-execution-payload-section"
import { WorkflowExecutionTimelineSection } from "./components/workflow-execution-timeline-section"

export const ExecutionDetail = () => {
  const { id } = useParams()

  const { workflow_execution, isLoading, isError, error } =
    useWorkflowExecution(id!)

  if (isLoading || !workflow_execution) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <WorkflowExecutionGeneralSection execution={workflow_execution} />
      <WorkflowExecutionTimelineSection execution={workflow_execution} />
      <WorkflowExecutionPayloadSection execution={workflow_execution} />
      <WorkflowExecutionHistorySection execution={workflow_execution} />
      <JsonViewSection data={workflow_execution} />
    </div>
  )
}
