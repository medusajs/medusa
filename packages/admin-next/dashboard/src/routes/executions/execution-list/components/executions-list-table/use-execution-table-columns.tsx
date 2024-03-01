import { Badge } from "@medusajs/ui"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StatusCell } from "../../../../../components/table/table-cells/common/status-cell"
import { WorkflowExecutionDTO } from "../../../types"

const columnHelper = createColumnHelper<WorkflowExecutionDTO>()

export const useExecutionTableColumns = (): ColumnDef<
  WorkflowExecutionDTO,
  any
>[] => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("transaction_id", {
        header: "Transaction ID",
        cell: ({ getValue }) => <Badge size="2xsmall">{getValue()}</Badge>,
      }),
      columnHelper.accessor("state", {
        header: "State",
        cell: ({ getValue }) => {
          const state = getValue()

          return (
            <StatusCell color="orange">
              <span className="capitalize">{state}</span>
            </StatusCell>
          )
        },
      }),
    ],
    []
  )
}
