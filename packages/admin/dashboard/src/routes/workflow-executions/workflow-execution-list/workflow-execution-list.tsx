import { WorkflowExecutionListTable } from "./components/workflow-execution-list-table"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useMedusaApp } from "../../../providers/medusa-app-provider"

export const WorkflowExcecutionList = () => {
  const { getWidgets } = useMedusaApp()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("workflow.list.after"),
        before: getWidgets("workflow.list.before"),
      }}
      hasOutlet={false}
    >
      <WorkflowExecutionListTable />
    </SingleColumnPage>
  )
}
