import { useAdminCustomQuery } from "medusa-react"
import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { adminExecutionKey } from "../utils"
import { WorkflowExecutionGeneralSection } from "./components/workflow-execution-general-section"
import { WorkflowExecutionHistorySection } from "./components/workflow-execution-history-section"
import { WorkflowExecutionPayloadSection } from "./components/workflow-execution-payload-section"
import { WorkflowExecutionTimelineSection } from "./components/workflow-execution-timeline-section"

export const ExecutionDetail = () => {
  const { id } = useParams()

  const { data, isLoading, isError, error } = useAdminCustomQuery(
    `/workflows-executions/${id}`,
    adminExecutionKey.detail(id!)
  )

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <div className="flex flex-col gap-y-2">
      <WorkflowExecutionGeneralSection execution={data.workflow_execution} />
      <WorkflowExecutionTimelineSection execution={data.workflow_execution} />
      <WorkflowExecutionPayloadSection execution={data.workflow_execution} />
      <WorkflowExecutionHistorySection execution={data.workflow_execution} />
      <JsonViewSection data={data.workflow_execution} />
    </div>
  )
}
