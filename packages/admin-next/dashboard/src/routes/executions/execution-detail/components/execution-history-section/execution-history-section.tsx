import { Spinner, TriangleDownMini } from "@medusajs/icons"
import { Container, Heading, IconButton, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { format } from "date-fns"
import {
  BLUE_STATES,
  GRAY_STATES,
  GREEN_STATES,
  ORANGE_STATES,
  RED_STATES,
} from "../../../constants"
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

const Event = ({
  step,
  isLast,
}: {
  step: WorkflowExecutionStep
  isLast: boolean
}) => {
  const identifier = step.id.split(".").pop()
  const isInvoking = step.invoke.state === TransactionStepState.INVOKING

  return (
    <div
      className="grid grid-cols-[20px_1fr] items-start gap-x-2 px-2"
      data-step-history-id={step.id}
    >
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
        <div className="flex h-full flex-col items-center">
          <div
            aria-hidden
            role="presentation"
            className={clx({
              "bg-ui-border-base h-full min-h-[14px] w-px": !isLast,
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
            {isInvoking ? (
              <div>
                <Spinner className="text-ui-fg-interactive animate-spin" />
              </div>
            ) : (
              <Text size="small" leading="compact" className="text-ui-fg-muted">
                {format(step.startedAt, "dd MMM yyyy HH:mm:ss")}
              </Text>
            )}
            <Collapsible.Trigger asChild>
              <IconButton size="2xsmall" variant="transparent">
                <TriangleDownMini className="text-ui-fg-muted" />
              </IconButton>
            </Collapsible.Trigger>
          </div>
        </div>
        <Collapsible.Content>
          <div className="flex flex-col gap-y-2 pb-4 pt-2">
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <Text size="small" leading="compact">
                Options
              </Text>
              <pre className="txt-compact-small bg-ui-bg-subtle rounded-md border p-2 font-mono">
                {JSON.stringify(step.definition, null, 2)}
              </pre>
            </div>
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <Text size="small" leading="compact">
                Input
              </Text>
            </div>
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <Text size="small" leading="compact">
                Result
              </Text>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
