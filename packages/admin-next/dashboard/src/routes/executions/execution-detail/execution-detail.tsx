import { useAdminCustomQuery } from "medusa-react"
import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { adminExecutionKey } from "../utils"
import { ExecutionGeneralSection } from "./components/execution-general-section"
import { ExecutionHistorySection } from "./components/execution-history-section"
import { ExecutionTimelineSection } from "./components/execution-timeline-section"

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
      <ExecutionGeneralSection execution={data.workflow_execution} />
      <ExecutionTimelineSection execution={data.workflow_execution} />
      <ExecutionHistorySection execution={data.workflow_execution} />
      <JsonViewSection data={data.workflow_execution} />
    </div>
  )
}
