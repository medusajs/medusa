import { Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

import { DataTable } from "../../../../../components/table/data-table"
import { useReturnReasons } from "../../../../../hooks/api/return-reasons"
import { useReturnReasonTableColumns } from "../../../../../hooks/table/columns"
import { useReturnReasonTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { returnReasonListLoader } from "../../loader"

const PAGE_SIZE = 20

export const ReturnReasonListTable = () => {
  const { t } = useTranslation()
  const { raw } = useReturnReasonTableQuery({
    pageSize: PAGE_SIZE,
  })

  const initialData = useLoaderData() as Awaited<
    ReturnType<typeof returnReasonListLoader>
  >

  const { return_reasons, isPending, isError, error } = useReturnReasons(
    {},
    {
      initialData,
      placeholderData: keepPreviousData,
    }
  )

  const columns = useReturnReasonTableColumns()

  const { table } = useDataTable({
    data: return_reasons,
    columns,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y px-0 py-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("returnReasons.domain")}</Heading>
      </div>
      <DataTable
        table={table}
        queryObject={raw}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        navigateTo={(row) => row.original.id}
        search
        pagination
        orderBy={["value", "created_at", "updated_at"]}
      />
    </Container>
  )
}
