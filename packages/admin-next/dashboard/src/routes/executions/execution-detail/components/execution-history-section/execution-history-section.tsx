import { Spinner, TriangleDownMini } from "@medusajs/icons"
import { Container, Copy, Heading, IconButton, Text, clx } from "@medusajs/ui"
import * as Collapsible from "@radix-ui/react-collapsible"
import { format } from "date-fns"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import {
  STEP_ERROR_STATES,
  STEP_INACTIVE_STATES,
  STEP_IN_PROGRESS_STATES,
  STEP_OK_STATES,
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
  const { t } = useTranslation()

  const map = Object.values(execution.execution?.steps || {})
  const steps = map.filter((step) => step.id !== "_root")

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("executions.history.sectionTitle")}</Heading>
      </div>
      <div className="flex flex-col gap-y-0.5 px-6 py-4">
        {steps.map((step, index) => {
          const stepId = step.id.split(".").pop()

          if (!stepId) {
            return null
          }

          const context = execution.context?.data.invoke[stepId]

          return (
            <Event
              key={step.id}
              step={step}
              stepInvokeContext={context}
              isLast={index === steps.length - 1}
            />
          )
        })}
      </div>
    </Container>
  )
}

const Event = ({
  step,
  stepInvokeContext,
  isLast,
}: {
  step: WorkflowExecutionStep
  stepInvokeContext:
    | {
        output: {
          output: unknown
          comensateInput: unknown
        }
      }
    | undefined
  isLast: boolean
}) => {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const { hash } = useLocation()

  const { t } = useTranslation()

  const stepId = step.id.split(".").pop()!

  useEffect(() => {
    if (hash === `#${stepId}`) {
      setOpen(true)
    }
  }, [hash, stepId])

  const identifier = step.id.split(".").pop()
  const isInvoking = step.invoke.state === TransactionStepState.INVOKING

  return (
    <div
      className="grid grid-cols-[20px_1fr] items-start gap-x-2 px-2"
      id={stepId}
    >
      <div className="grid h-full grid-rows-[20px_1fr] items-center justify-center gap-y-0.5">
        <div className="flex size-5 items-center justify-center">
          <div className="bg-ui-bg-base shadow-borders-base flex size-2.5 items-center justify-center rounded-full">
            <div
              className={clx("size-1.5 rounded-full", {
                "bg-ui-tag-green-icon": STEP_OK_STATES.includes(
                  step.invoke.state
                ),
                "bg-ui-tag-orange-icon": STEP_IN_PROGRESS_STATES.includes(
                  step.invoke.state
                ),
                "bg-ui-tag-red-icon": STEP_ERROR_STATES.includes(
                  step.invoke.state
                ),
                "bg-ui-tag-neutral-icon": STEP_INACTIVE_STATES.includes(
                  step.invoke.state
                ),
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
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <div className="flex items-start justify-between">
          <Text size="small" leading="compact" weight="plus">
            {identifier}
          </Text>
          <div className="flex items-center gap-x-2">
            {isInvoking ? (
              <div className="flex items-center gap-x-1">
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {t("executions.history.runningState")}
                </Text>
                <Spinner className="text-ui-fg-interactive animate-spin" />
              </div>
            ) : step.startedAt ? (
              <Text size="small" leading="compact" className="text-ui-fg-muted">
                {format(step.startedAt, "dd MMM yyyy HH:mm:ss")}
              </Text>
            ) : (
              <Text size="small" leading="compact" className="text-ui-fg-muted">
                {t("executions.history.awaitingState")}
              </Text>
            )}
            <Collapsible.Trigger asChild>
              <IconButton size="2xsmall" variant="transparent">
                <TriangleDownMini className="text-ui-fg-muted" />
              </IconButton>
            </Collapsible.Trigger>
          </div>
        </div>
        <Collapsible.Content ref={ref}>
          <div className="flex flex-col gap-y-2 pb-4 pt-2">
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <Text size="small" leading="compact">
                {t("executions.history.definitionLabel")}
              </Text>
              <Codeblock data={step.definition} />
            </div>
            {stepInvokeContext && (
              <div className="text-ui-fg-subtle flex flex-col gap-y-2">
                <Text size="small" leading="compact">
                  {t("executions.history.outputLabel")}
                </Text>
                <Codeblock data={stepInvokeContext.output} />
              </div>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

const Codeblock = ({ data }: { data: unknown }) => {
  const stringified = JSON.stringify(data, null, 2)

  return (
    <div className="relative">
      <Copy
        content={stringified}
        variant={"mini"}
        className="text-ui-fg-muted absolute right-2 top-1 flex h-7 w-7 items-center justify-center"
      />
      <pre className="txt-compact-small bg-ui-bg-subtle rounded-md border p-2 font-mono">
        {stringified}
      </pre>
    </div>
  )
}
