import { JsonViewSection } from "../../../../../components/common/json-view-section"
import { WorkflowExecutionDTO } from "../../../types"

type ExecutionPayloadSectionProps = {
  execution: WorkflowExecutionDTO
}

export const ExecutionPayloadSection = ({
  execution,
}: ExecutionPayloadSectionProps) => {
  let payload = execution.context?.data?.payload

  if (!payload) {
    return null
  }

  // payloads may be simple primitives, so we need to wrap them in an object
  // to ensure the JsonViewSection component can render them
  if (typeof payload !== "object") {
    payload = { input: payload }
  }

  return <JsonViewSection title="Payload" data={payload as object} />
}
