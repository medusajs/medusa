import { Badge } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import {
  TransactionStepState,
  WorkflowExecutionDTO,
  WorkflowExecutionStep,
} from "../../../types"
import { getTransactionState, getTransactionStateColor } from "../../../utils"

const columnHelper = createColumnHelper<WorkflowExecutionDTO>()

export const useWorkflowExecutionTableColumns = (): ColumnDef<
  WorkflowExecutionDTO,
  any
>[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("transaction_id", {
        header: t("workflowExecutions.transactionIdLabel"),
        cell: ({ getValue }) => <Badge size="2xsmall">{getValue()}</Badge>,
      }),
      columnHelper.accessor("state", {
        header: t("fields.state"),
        cell: ({ getValue }) => {
          const state = getValue()

          const color = getTransactionStateColor(state)
          const translatedState = getTransactionState(t, state)

          return (
            <StatusCell color={color}>
              <span className="capitalize">{translatedState}</span>
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("execution", {
        header: t("workflowExecutions.progressLabel"),
        cell: ({ getValue }) => {
          const steps = getValue()?.steps as
            | Record<string, WorkflowExecutionStep>
            | undefined

          if (!steps) {
            return "0 of 0 steps"
          }

          const actionableSteps = Object.values(steps).filter(
            (step) => step.id !== ROOT_PREFIX
          )

          const completedSteps = actionableSteps.filter(
            (step) => step.invoke.state === TransactionStepState.DONE
          )

          return t("workflowExecutions.stepsCompletedLabel", {
            completed: completedSteps.length,
            count: actionableSteps.length,
          })
        },
      }),
    ],
    [t]
  )
}

const ROOT_PREFIX = "_root"
