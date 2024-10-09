import { WorkflowExecutionListTable } from "./components/workflow-execution-list-table"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"

export const WorkflowExcecutionList = () => {
  const { getWidgets } = useDashboardExtension()

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
