import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/data-table"
import { useReturnReasons } from "../../../../../hooks/api/return-reasons"
import { useReturnReasonTableColumns } from "../../../../../hooks/table/columns"
import { useReturnReasonTableQuery } from "../../../../../hooks/table/query"
import { ReturnReasonListTableActions } from "./return-reason-list-table-actions"

const PAGE_SIZE = 20

export const ReturnReasonListTable = () => {
  const { t } = useTranslation()
  const { searchParams } = useReturnReasonTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { return_reasons, count, isLoading, isError, error } = useReturnReasons(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <DataTable
        data={return_reasons}
        columns={columns}
        rowCount={count}
        pageSize={PAGE_SIZE}
        getRowId={(row) => row.id}
        heading={t("returnReasons.domain")}
        subHeading={t("returnReasons.subtitle")}
        emptyState={{
          empty: {
            heading: t("general.noRecordsMessage"),
          },
          filtered: {
            heading: t("general.noRecordsMessage"),
            description: t("general.noRecordsMessageFiltered"),
          },
        }}
        actions={[
          {
            label: t("actions.create"),
            to: "create",
          },
        ]}
        isLoading={isLoading}
        enableSearch={true}
      />
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminReturnReason>()

const useColumns = () => {
  const base = useReturnReasonTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "action",
        cell: ({ row }) => (
          <ReturnReasonListTableActions returnReason={row.original} />
        ),
      }),
    ],
    [base]
  )
}
