import {
  Badge,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  clx,
} from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import {
  TransactionStepState,
  WorkflowExecutionDTO,
  WorkflowExecutionStep,
} from "../../../types"
import { getTransactionState, getTransactionStateColor } from "../../../utils"

type WorkflowExecutionGeneralSectionProps = {
  execution: WorkflowExecutionDTO
}

export const WorkflowExecutionGeneralSection = ({
  execution,
}: WorkflowExecutionGeneralSectionProps) => {
  const { t } = useTranslation()

  const cleanId = execution.id.replace("wf_exec_", "")
  const translatedState = getTransactionState(t, execution.state)
  const stateColor = getTransactionStateColor(execution.state)

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-x-0.5">
          <Heading>{cleanId}</Heading>
          <Copy content={cleanId} className="text-ui-fg-muted" />
        </div>
        <StatusBadge color={stateColor}>{translatedState}</StatusBadge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("workflowExecutions.workflowIdLabel")}
        </Text>
        <Badge size="2xsmall" className="w-fit">
          {execution.workflow_id}
        </Badge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("workflowExecutions.transactionIdLabel")}
        </Text>
        <Badge size="2xsmall" className="w-fit">
          {execution.transaction_id}
        </Badge>
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("workflowExecutions.progressLabel")}
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
  const { t } = useTranslation()

  if (!steps) {
    return (
      <Text size="small" leading="compact" className="text-ui-fg-subtle">
        {t("workflowExecutions.stepsCompletedLabel", {
          completed: 0,
          total: 0,
        })}
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
        {t("workflowExecutions.stepsCompletedLabel", {
          completed: completedSteps.length,
          count: actionableSteps.length,
        })}
      </Text>
    </div>
  )
}
