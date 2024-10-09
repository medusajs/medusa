import { useParams } from "react-router-dom"

import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { useWorkflowExecution } from "../../../hooks/api/workflow-executions"
import { WorkflowExecutionGeneralSection } from "./components/workflow-execution-general-section"
import { WorkflowExecutionHistorySection } from "./components/workflow-execution-history-section"
import { WorkflowExecutionPayloadSection } from "./components/workflow-execution-payload-section"
import { WorkflowExecutionTimelineSection } from "./components/workflow-execution-timeline-section"

export const ExecutionDetail = () => {
  const { id } = useParams()

  const { workflow_execution, isLoading, isError, error } =
    useWorkflowExecution(id!)

  const { getWidgets } = useDashboardExtension()

  if (isLoading || !workflow_execution) {
    return <SingleColumnPageSkeleton sections={4} showJSON />
  }

  if (isError) {
    throw error
  }

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("workflow.details.after"),
        before: getWidgets("workflow.details.before"),
      }}
      data={workflow_execution}
      showJSON
    >
      <WorkflowExecutionGeneralSection execution={workflow_execution} />
      <WorkflowExecutionTimelineSection execution={workflow_execution} />
      <WorkflowExecutionPayloadSection execution={workflow_execution} />
      <WorkflowExecutionHistorySection execution={workflow_execution} />
    </SingleColumnPage>
  )
}
