import { useAdminCustomQuery } from "medusa-react"
import { useParams } from "react-router-dom"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { ExecutionGeneralSection } from "./components/execution-general-section"
import { ExecutionHistorySection } from "./components/execution-history-section"

export const ExecutionDetail = () => {
  const { id } = useParams()

  const { data, isLoading, isError, error } = useAdminCustomQuery(
    `/workflows-executions/${id}`,
    ["workflow_executions", "detail", id]
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
      <ExecutionHistorySection execution={data.workflow_execution} />
      <JsonViewSection data={data.workflow_execution} />
    </div>
  )
}
