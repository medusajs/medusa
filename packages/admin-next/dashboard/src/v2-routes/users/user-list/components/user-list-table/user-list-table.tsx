import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useUsers } from "../../../../../hooks/api/users"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useUserTableColumns } from "./use-user-table-columns"
import { useUserTableQuery } from "./use-user-table-query"

const PAGE_SIZE = 20

export const UserListTable = () => {
  const { raw, searchParams } = useUserTableQuery({
    pageSize: PAGE_SIZE,
  })
  const {
    users,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useUsers(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useUserTableColumns()

  const { table } = useDataTable({
    data: users ?? [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  const { t } = useTranslation()

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("users.domain")}</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to="invite">{t("users.invite")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        orderBy={["email", "first_name", "last_name"]}
        navigateTo={(row) => `${row.id}`}
        search
        pagination
        queryObject={raw}
      />
    </Container>
  )
}
