import { JsonViewSection } from "../../../../../components/common/json-view-section"
import { WorkflowExecutionDTO } from "../../../types"

type WorkflowExecutionPayloadSectionProps = {
  execution: WorkflowExecutionDTO
}

export const WorkflowExecutionPayloadSection = ({
  execution,
}: WorkflowExecutionPayloadSectionProps) => {
  let payload = execution.context?.data?.payload

  if (!payload) {
    return null
  }

  // payloads may be a primitive, so we need to wrap them in an object
  // to ensure the JsonViewSection component can render them.
  if (typeof payload !== "object") {
    payload = { input: payload }
  }

  return <JsonViewSection data={payload as object} />
}
