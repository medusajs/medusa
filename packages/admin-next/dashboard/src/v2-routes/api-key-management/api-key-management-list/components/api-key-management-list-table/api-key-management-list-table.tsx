import { Button, Container, Heading } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useApiKeys } from "../../../../../hooks/api/api-keys"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useApiKeyManagementTableColumns } from "./use-api-key-management-table-columns"
import { useApiKeyManagementTableFilters } from "./use-api-key-management-table-filters"
import { useApiKeyManagementTableQuery } from "./use-api-key-management-table-query"

const PAGE_SIZE = 20

export const ApiKeyManagementListTable = ({
  keyType,
}: {
  keyType: "secret" | "publishable"
}) => {
  const { t } = useTranslation()

  const { searchParams, raw } = useApiKeyManagementTableQuery({
    pageSize: PAGE_SIZE,
  })

  const query = {
    ...searchParams,
    type: keyType,
    fields:
      "id,title,redacted,token,type,created_at,updated_at,revoked_at,last_used_at,created_by,revoked_by",
  }

  const { api_keys, count, isLoading, isError, error } = useApiKeys(query, {
    placeholderData: keepPreviousData,
  })

  const filters = useApiKeyManagementTableFilters()
  const columns = useApiKeyManagementTableColumns()

  const { table } = useDataTable({
    data: api_keys || [],
    columns,
    count,
    enablePagination: true,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">
          {keyType === "publishable"
            ? t(`apiKeyManagement.domain.publishable`)
            : t("apiKeyManagement.domain.secret")}
        </Heading>
        <Link to="create">
          <Button variant="secondary" size="small">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        filters={filters}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        orderBy={["title", "created_at", "updated_at", "revoked_at"]}
        navigateTo={(row) => row.id}
        pagination
        search
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}
