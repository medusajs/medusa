import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"

import { LayoutComposer } from "../../../components/layout-composer"
import { WorkflowExecutionListTable } from "./components/workflow-execution-list-table"

export const WorkflowExcecutionList = () => {
  return (
    <LayoutComposer
      widgetsZonePrefix="workflow.list"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      hasOutlet={false}
      sections={{
        main: (
          <LayoutComposer.Entry id="WorkflowExecutionListTable">
            <WorkflowExecutionListTable />
          </LayoutComposer.Entry>
        ),
      }}
    />
  )
}
