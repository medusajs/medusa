import { Spinner, TriangleDownMini } from "@medusajs/icons"
import {
  CodeBlock,
  Container,
  Heading,
  IconButton,
  Text,
  clx,
} from "@medusajs/ui"
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
  StepError,
  StepInvoke,
  TransactionStepState,
  TransactionStepStatus,
  WorkflowExecutionDTO,
  WorkflowExecutionStep,
} from "../../../types"

type WorkflowExecutionHistorySectionProps = {
  execution: WorkflowExecutionDTO
}

export const WorkflowExecutionHistorySection = ({
  execution,
}: WorkflowExecutionHistorySectionProps) => {
  const { t } = useTranslation()

  const map = Object.values(execution.execution?.steps || {})
  const steps = map.filter((step) => step.id !== "_root")

  // check if any of the steps have a .invoke.state of "permanent_failure" and if that is the case then return its id
  const unreachableStepId = steps.find(
    (step) => step.invoke.status === TransactionStepStatus.PERMANENT_FAILURE
  )?.id

  // return an array of step ids of all steps that come after the unreachable step if there is one
  const unreachableSteps = unreachableStepId
    ? steps
        .filter(
          (step) =>
            step.id !== unreachableStepId && step.id.includes(unreachableStepId)
        )
        .map((step) => step.id)
    : []

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          {t("workflowExecutions.history.sectionTitle")}
        </Heading>
      </div>
      <div className="flex flex-col gap-y-0.5 px-6 py-4">
        {steps.map((step, index) => {
          const stepId = step.id.split(".").pop()

          if (!stepId) {
            return null
          }

          const context = execution.context?.data.invoke[stepId]
          const error = execution.context?.errors.find(
            (e) => e.action === stepId
          )

          return (
            <Event
              key={step.id}
              step={step}
              stepInvokeContext={context}
              stepError={error}
              isLast={index === steps.length - 1}
              isUnreachable={unreachableSteps.includes(step.id)}
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
  stepError,
  isLast,
  isUnreachable,
}: {
  step: WorkflowExecutionStep
  stepInvokeContext: StepInvoke | undefined
  stepError?: StepError | undefined
  isLast: boolean
  isUnreachable?: boolean
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

  stepInvokeContext

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
        <Collapsible.Trigger asChild>
          <div className="group flex cursor-pointer items-start justify-between outline-none">
            <Text size="small" leading="compact" weight="plus">
              {identifier}
            </Text>
            <div className="flex items-center gap-x-2">
              <StepState
                state={step.invoke.state}
                startedAt={step.startedAt}
                isUnreachable={isUnreachable}
              />
              <IconButton size="2xsmall" variant="transparent">
                <TriangleDownMini className="text-ui-fg-muted transition-transform group-data-[state=open]:rotate-180" />
              </IconButton>
            </div>
          </div>
        </Collapsible.Trigger>
        <Collapsible.Content ref={ref}>
          <div className="flex flex-col gap-y-2 pb-4 pt-2">
            <div className="text-ui-fg-subtle flex flex-col gap-y-2">
              <Text size="small" leading="compact">
                {t("workflowExecutions.history.definitionLabel")}
              </Text>
              <CodeBlock
                snippets={[
                  {
                    code: JSON.stringify(step.definition, null, 2),
                    label: t("workflowExecutions.history.definitionLabel"),
                    language: "json",
                    hideLineNumbers: true,
                  },
                ]}
              >
                <CodeBlock.Body />
              </CodeBlock>
            </div>
            {stepInvokeContext && (
              <div className="text-ui-fg-subtle flex flex-col gap-y-2">
                <Text size="small" leading="compact">
                  {t("workflowExecutions.history.outputLabel")}
                </Text>
                <CodeBlock
                  snippets={[
                    {
                      code: JSON.stringify(
                        stepInvokeContext.output.output,
                        null,
                        2
                      ),
                      label: t("workflowExecutions.history.outputLabel"),
                      language: "json",
                      hideLineNumbers: true,
                    },
                  ]}
                >
                  <CodeBlock.Body />
                </CodeBlock>
              </div>
            )}
            {!!stepInvokeContext?.output.compensateInput &&
              step.compensate.state === TransactionStepState.REVERTED && (
                <div className="text-ui-fg-subtle flex flex-col gap-y-2">
                  <Text size="small" leading="compact">
                    {t("workflowExecutions.history.compensateInputLabel")}
                  </Text>
                  <CodeBlock
                    snippets={[
                      {
                        code: JSON.stringify(
                          stepInvokeContext.output.compensateInput,
                          null,
                          2
                        ),
                        label: t(
                          "workflowExecutions.history.compensateInputLabel"
                        ),
                        language: "json",
                        hideLineNumbers: true,
                      },
                    ]}
                  >
                    <CodeBlock.Body />
                  </CodeBlock>
                </div>
              )}
            {stepError && (
              <div className="text-ui-fg-subtle flex flex-col gap-y-2">
                <Text size="small" leading="compact">
                  {t("workflowExecutions.history.errorLabel")}
                </Text>
                <CodeBlock
                  snippets={[
                    {
                      code: JSON.stringify(
                        {
                          error: stepError.error,
                          handlerType: stepError.handlerType,
                        },
                        null,
                        2
                      ),
                      label: t("workflowExecutions.history.errorLabel"),
                      language: "json",
                      hideLineNumbers: true,
                    },
                  ]}
                >
                  <CodeBlock.Body />
                </CodeBlock>
              </div>
            )}
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}

const StepState = ({
  state,
  startedAt,
  isUnreachable,
}: {
  state: TransactionStepState
  startedAt?: number | null
  isUnreachable?: boolean
}) => {
  const { t } = useTranslation()

  const isFailed = state === TransactionStepState.FAILED
  const isRunning = state === TransactionStepState.INVOKING

  if (isUnreachable) {
    return null
  }

  if (isRunning) {
    return (
      <div className="flex items-center gap-x-1">
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("workflowExecutions.history.runningState")}
        </Text>
        <Spinner className="text-ui-fg-interactive animate-spin" />
      </div>
    )
  }

  if (isFailed) {
    return (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {t("workflowExecutions.history.failedState")}
      </Text>
    )
  }

  if (startedAt) {
    return (
      <Text size="small" leading="compact" className="text-ui-fg-muted">
        {format(startedAt, "dd MMM yyyy HH:mm:ss")}
      </Text>
    )
  }
}
