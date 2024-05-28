import { WorkflowExecutionListTable } from "./components/workflow-execution-list-table"

import after from "virtual:medusa/widgets/workflow/list/after"
import before from "virtual:medusa/widgets/workflow/list/before"

export const WorkflowExcecutionList = () => {
  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
      <WorkflowExecutionListTable />
      {after.widgets.map((w, i) => {
        return (
          <div key={i}>
            <w.Component />
          </div>
        )
      })}
    </div>
  )
}
