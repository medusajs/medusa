import { Spinner, TriangleDownMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import {
  clx,
  CodeBlock,
  Container,
  Heading,
  IconButton,
  Text,
} from "@medusajs/ui"
import { format } from "date-fns"
import { Collapsible as RadixCollapsible } from "radix-ui"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router-dom"
import {
  STEP_ERROR_STATES,
  STEP_IN_PROGRESS_STATES,
  STEP_INACTIVE_STATES,
  STEP_OK_STATES,
  STEP_SKIPPED_STATES,
} from "../../../constants"
import { TransactionStepState } from "../../../types"
import {
  getExecutionSteps,
  getStepName,
  getUnreachableStepNames,
} from "../../../utils"

type WorkflowExecutionHistorySectionProps = {
  execution: HttpTypes.AdminWorkflowExecution
}

export const WorkflowExecutionHistorySection = ({
  execution,
}: WorkflowExecutionHistorySectionProps) => {
  const { t } = useTranslation()

  const steps = getExecutionSteps(execution.execution?.steps)
  const unreachableSteps = getUnreachableStepNames(steps)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          {t("workflowExecutions.history.sectionTitle")}
        </Heading>
      </div>
      <div className="flex flex-col gap-y-0.5 px-6 py-4">
        {steps.map((step, index) => {
          const stepName = getStepName(step)
          const context = execution.context?.data.invoke[stepName]
          const errors =
            execution.context?.errors.filter((e) => e.action === stepName) ?? []

          return (
            <Event
              key={step.id}
              step={step}
              stepName={stepName}
              stepInvokeContext={context}
              stepErrors={errors}
              isLast={index === steps.length - 1}
              isUnreachable={unreachableSteps.has(stepName)}
            />
          )
        })}
      </div>
    </Container>
  )
}

const Event = ({
  step,
  stepName,
  stepInvokeContext,
  stepErrors,
  isLast,
  isUnreachable,
}: {
  step: HttpTypes.AdminWorkflowExecutionStep
  stepName: string
  stepInvokeContext: HttpTypes.StepInvokeResult | undefined
  stepErrors: HttpTypes.StepError[]
  isLast: boolean
  isUnreachable?: boolean
}) => {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)
  const { hash } = useLocation()

  const { t } = useTranslation()

  useEffect(() => {
    if (safeDecode(hash.slice(1)) === stepName) {
      setOpen(true)
    }
  }, [hash, stepName])

  return (
    <div
      className="grid grid-cols-[20px_1fr] items-start gap-x-2 px-2"
      id={stepName}
    >
      <div className="grid h-full grid-rows-[20px_1fr] items-center justify-center gap-y-0.5">
        <div className="flex size-5 items-center justify-center">
          <div className="bg-ui-bg-base shadow-borders-base flex size-2.5 items-center justify-center rounded-full">
            <div
              className={clx("size-1.5 rounded-full", {
                "bg-ui-tag-neutral-bg": STEP_SKIPPED_STATES.includes(
                  step.invoke.state
                ),
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
      <RadixCollapsible.Root open={open} onOpenChange={setOpen}>
        <RadixCollapsible.Trigger asChild>
          <div className="group flex cursor-pointer items-start justify-between outline-none">
            <Text size="small" leading="compact" weight="plus">
              {stepName}
            </Text>
            <div className="flex items-center gap-x-2">
              <StepState
                state={step.invoke.state}
                startedAt={step.startedAt}
                isReverted={
                  step.compensate.state === TransactionStepState.REVERTED
                }
                isUnreachable={isUnreachable}
              />
              <IconButton size="2xsmall" variant="transparent">
                <TriangleDownMini className="text-ui-fg-muted transition-transform group-data-[state=open]:rotate-180" />
              </IconButton>
            </div>
          </div>
        </RadixCollapsible.Trigger>
        <RadixCollapsible.Content ref={ref}>
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
                        // TODO: Apply resolve value: packages/core/workflows-sdk/src/utils/composer/helpers/resolve-value.ts
                        stepInvokeContext?.output?.output ?? {},
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
            {!!stepInvokeContext?.output?.compensateInput &&
              step.compensate.state === TransactionStepState.REVERTED && (
                <div className="text-ui-fg-subtle flex flex-col gap-y-2">
                  <Text size="small" leading="compact">
                    {t("workflowExecutions.history.compensateInputLabel")}
                  </Text>
                  <CodeBlock
                    snippets={[
                      {
                        // TODO: Apply resolve value: packages/core/workflows-sdk/src/utils/composer/helpers/resolve-value.ts
                        code: JSON.stringify(
                          stepInvokeContext?.output?.compensateInput ?? {},
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
            {stepErrors.map((stepError, index) => (
              <div
                key={`${stepError.handlerType}-${index}`}
                className="text-ui-fg-subtle flex flex-col gap-y-2"
              >
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
            ))}
          </div>
        </RadixCollapsible.Content>
      </RadixCollapsible.Root>
    </div>
  )
}

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const StepState = ({
  state,
  startedAt,
  isReverted,
  isUnreachable,
}: {
  state: HttpTypes.TransactionStepState
  startedAt?: number | null
  isReverted?: boolean
  isUnreachable?: boolean
}) => {
  const { t } = useTranslation()

  const isFailed = state === TransactionStepState.FAILED
  const isRunning = state === TransactionStepState.INVOKING
  const isSkipped = state === TransactionStepState.SKIPPED
  const isSkippedFailure = state === TransactionStepState.SKIPPED_FAILURE
  const isTimeout = state === TransactionStepState.TIMEOUT

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

  let stateText: string | undefined

  if (isSkipped) {
    stateText = t("workflowExecutions.history.skippedState")
  } else if (isSkippedFailure) {
    stateText = t("workflowExecutions.history.skippedFailureState")
  } else if (isFailed) {
    stateText = t("workflowExecutions.history.failedState")
  } else if (isTimeout) {
    stateText = t("workflowExecutions.step.state.timeout")
  } else if (isReverted) {
    stateText = t("workflowExecutions.history.revertedLabel")
  }

  if (stateText) {
    return (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {stateText}
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

  return null
}
