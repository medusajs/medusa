import { Badge, Container, Heading, Text, clx } from "@medusajs/ui"
import {
  TransactionStepState,
  WorkflowExecutionDTO,
  WorkflowExecutionStep,
} from "../../../types"

type ExecutionGeneralSectionProps = {
  execution: WorkflowExecutionDTO
}

export const ExecutionGeneralSection = ({
  execution,
}: ExecutionGeneralSectionProps) => {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{execution.transaction_id}</Heading>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Workflow ID
        </Text>
        <Badge size="2xsmall" className="w-fit">
          {execution.workflow_id}
        </Badge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          Progress
        </Text>
        <Progress steps={execution.execution?.steps} />
      </div>
    </Container>
  )
}

const ROOT_PREFIX = "_root"

const Progress = ({
  steps,
}: {
  steps?: Record<string, WorkflowExecutionStep> | null
}) => {
  if (!steps) {
    return (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        0 of 0 steps
      </Text>
    )
  }

  const actionableSteps = Object.values(steps).filter(
    (step) => step.id !== ROOT_PREFIX
  )

  const completedSteps = actionableSteps.filter(
    (step) => step.invoke.state === TransactionStepState.DONE
  )

  return (
    <div className="flex w-fit items-center gap-x-2">
      <div className="flex items-center gap-x-[3px]">
        {actionableSteps.map((step) => (
          <div
            key={step.id}
            className={clx(
              "bg-ui-bg-switch-off shadow-details-switch-background h-3 w-1.5 rounded-full",
              {
                "bg-ui-fg-muted":
                  step.invoke.state === TransactionStepState.DONE,
              }
            )}
          />
        ))}
      </div>
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {completedSteps.length} of {Object.keys(steps).length - 1} steps
      </Text>
    </div>
  )
}
