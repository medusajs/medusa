import { WorkflowExecutionListTable } from "./components/workflow-execution-list-table"

import { SingleColumnPage } from "../../../components/layout/pages"
import { useExtension } from "../../../providers/extension-provider"

export const WorkflowExcecutionList = () => {
  const { getWidgets } = useExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("workflow.list.after"),
        before: getWidgets("workflow.list.before"),
      }}
      hasOutlet={false}
      showRequiredPermissions
    >
      <WorkflowExecutionListTable />
    </SingleColumnPage>
  )
}
