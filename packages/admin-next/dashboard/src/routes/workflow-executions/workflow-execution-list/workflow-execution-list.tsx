import { WorkflowExecutionListTable } from "./components/workflow-execution-list-table"

export const WorkflowExcecutionList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <WorkflowExecutionListTable />
    </div>
  )
}
