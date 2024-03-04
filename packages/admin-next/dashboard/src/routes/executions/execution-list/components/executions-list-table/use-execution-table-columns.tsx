import { Badge } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import {
  TRANSACTION_ERROR_STATES,
  TRANSACTION_IN_PROGRESS_STATES,
} from "../../../constants"
import {
  TransactionStepState,
  WorkflowExecutionDTO,
  WorkflowExecutionStep,
} from "../../../types"

const columnHelper = createColumnHelper<WorkflowExecutionDTO>()

export const useExecutionTableColumns = (): ColumnDef<
  WorkflowExecutionDTO,
  any
>[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("transaction_id", {
        header: t("executions.transactionIdLabel"),
        cell: ({ getValue }) => <Badge size="2xsmall">{getValue()}</Badge>,
      }),
      columnHelper.accessor("state", {
        header: t("fields.state"),
        cell: ({ getValue }) => {
          const state = getValue()

          let color: "green" | "red" | "orange" = "green"

          if (TRANSACTION_ERROR_STATES.includes(state)) {
            color = "red"
          }

          if (TRANSACTION_IN_PROGRESS_STATES.includes(state)) {
            color = "orange"
          }

          return (
            <StatusCell color={color}>
              <span className="capitalize">{state}</span>
            </StatusCell>
          )
        },
      }),
      columnHelper.accessor("execution", {
        header: t("executions.progressLabel"),
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

          return t("executions.stepsCompletedLabel", {
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
