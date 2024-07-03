import { Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useWorkflowExecutions } from "../../../../../hooks/api/workflow-executions"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { WorkflowExecutionDTO } from "../../../types"
import { useWorkflowExecutionTableColumns } from "./use-workflow-execution-table-columns"
import { useWorkflowExecutionTableQuery } from "./use-workflow-execution-table-query"

/**
 * Type isn't exported from the package
 */
type WorkflowExecutionsRes = {
  workflow_executions: WorkflowExecutionDTO[]
  count: number
  offset: number
  limit: number
}

const PAGE_SIZE = 20

export const WorkflowExecutionListTable = () => {
  const { t } = useTranslation()

  const { searchParams, raw } = useWorkflowExecutionTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { workflow_executions, count, isLoading, isError, error } =
    useWorkflowExecutions(
      {
        ...searchParams,
        fields: "execution,state",
      },
      {
        placeholderData: keepPreviousData,
      }
    )

  const columns = useWorkflowExecutionTableColumns()

  const { table } = useDataTable({
    data: workflow_executions || [],
    columns,
    count: count,
    pageSize: PAGE_SIZE,
    enablePagination: true,
    getRowId: (row) => row.id,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("workflowExecutions.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t(`workflowExecutions.subtitle`)}
          </Text>
        </div>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        navigateTo={(row) => `${row.id}`}
        search
        pagination
        queryObject={raw}
        noRecords={{
          message: t("workflowExecutions.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}
