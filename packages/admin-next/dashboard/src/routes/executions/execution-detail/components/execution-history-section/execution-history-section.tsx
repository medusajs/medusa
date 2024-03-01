import { TriangleDownMini } from "@medusajs/icons"
import { Container, Heading, IconButton, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { format } from "date-fns"
import {
  TransactionStepState,
  WorkflowExecutionDTO,
  WorkflowExecutionStep,
} from "../../../types"

type ExecutionHistorySectionProps = {
  execution: WorkflowExecutionDTO
}

export const ExecutionHistorySection = ({
  execution,
}: ExecutionHistorySectionProps) => {
  const map = Object.values(execution.execution?.steps || {})
  const steps = map.filter((step) => step.id !== "_root")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">History</Heading>
      </div>
      <div className="flex flex-col gap-y-0.5 px-6 py-4">
        {steps.map((step, index) => (
          <Event
            key={step.id}
            step={step}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </Container>
  )
}

const BLUE_STATES = [TransactionStepState.INVOKING]

const ORANGE_STATES = [
  TransactionStepState.COMPENSATING,
  TransactionStepState.SKIPPED,
]

const GREEN_STATES = [TransactionStepState.DONE]

const RED_STATES = [
  TransactionStepState.FAILED,
  TransactionStepState.REVERTED,
  TransactionStepState.TIMEOUT,
  TransactionStepState.DORMANT,
]

const GRAY_STATES = [TransactionStepState.NOT_STARTED]

const Event = ({
  step,
  isLast,
}: {
  step: WorkflowExecutionStep
  isLast: boolean
}) => {
  const identifier = step.id.split(".").pop()

  return (
    <div className="grid grid-cols-[20px_1fr] items-start gap-x-2 px-2">
      <div className="grid h-full grid-rows-[20px_1fr] items-center justify-center gap-y-0.5">
        <div className="flex size-5 items-center justify-center">
          <div className="bg-ui-bg-base shadow-borders-base flex size-2.5 items-center justify-center rounded-full">
            <div
              className={clx("size-1.5 rounded-full", {
                "bg-ui-tag-green-icon": GREEN_STATES.includes(
                  step.invoke.state
                ),
                "bg-ui-tag-blue-icon": BLUE_STATES.includes(step.invoke.state),
                "bg-ui-tag-orange-icon": ORANGE_STATES.includes(
                  step.invoke.state
                ),
                "bg-ui-tag-red-icon": RED_STATES.includes(step.invoke.state),
                "bg-ui-tag-gray-icon": GRAY_STATES.includes(step.invoke.state),
              })}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div
            aria-hidden
            role="presentation"
            className={clx("h-full min-h-[14px] w-px", {
              "bg-ui-border-base": !isLast,
            })}
          />
        </div>
      </div>
      <Collapsible.Root>
        <div className="flex items-start justify-between">
          <Text size="small" leading="compact" weight="plus">
            {identifier}
          </Text>
          <div className="flex items-center gap-x-2">
            <Text size="small" leading="compact" className="text-ui-fg-muted">
              {format(step.startedAt, "dd MMM yyyy HH:mm:ss")}
            </Text>
            <Collapsible.Trigger asChild>
              <IconButton size="2xsmall" variant="transparent">
                <TriangleDownMini className="text-ui-fg-muted" />
              </IconButton>
            </Collapsible.Trigger>
          </div>
        </div>
        <Collapsible.Content>
          <div>
            <pre className="txt-compact-small">
              {JSON.stringify(step, null, 2)}
            </pre>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
