import { useParams } from "react-router-dom"

import { CORE_LAYOUT_IDS } from "@medusajs/admin-shared"
import { JsonViewSection } from "../../../components/common/json-view-section"
import { SingleColumnPageSkeleton } from "../../../components/common/skeleton"
import { LayoutComposer } from "../../../components/layout-composer"
import { useWorkflowExecution } from "../../../hooks/api/workflow-executions"
import { WorkflowExecutionGeneralSection } from "./components/workflow-execution-general-section"
import { WorkflowExecutionHistorySection } from "./components/workflow-execution-history-section"
import { WorkflowExecutionPayloadSection } from "./components/workflow-execution-payload-section"
import { WorkflowExecutionTimelineSection } from "./components/workflow-execution-timeline-section"

export const ExecutionDetail = () => {
  const { id } = useParams()

  const { workflow_execution, isLoading, isError, error } =
    useWorkflowExecution(id!)

  if (isLoading || !workflow_execution) {
    return <SingleColumnPageSkeleton sections={4} showJSON />
  }

  if (isError) {
    throw error
  }

  return (
    <LayoutComposer
      widgetsZonePrefix="workflow.details"
      preferredLayoutId={CORE_LAYOUT_IDS.SINGLE_COLUMN}
      data={workflow_execution}
      sections={{
        main: (
          <>
            <WorkflowExecutionGeneralSection execution={workflow_execution} />
            <WorkflowExecutionTimelineSection execution={workflow_execution} />
            <WorkflowExecutionPayloadSection execution={workflow_execution} />
            <WorkflowExecutionHistorySection execution={workflow_execution} />
            <JsonViewSection data={workflow_execution} />
          </>
        ),
      }}
    />
  )
}
