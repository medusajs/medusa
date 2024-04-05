import { Button, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { keepPreviousData } from "@tanstack/react-query"
import { DataTable } from "../../../../../components/table/data-table"
import { useCollections } from "../../../../../hooks/api/collections"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useCollectionTableColumns } from "./use-collection-table-columns"
import { useCollectionTableFilters } from "./use-collection-table-filters"
import { useCollectionTableQuery } from "./use-collection-table-query"

const PAGE_SIZE = 20

export const CollectionListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useCollectionTableQuery({ pageSize: PAGE_SIZE })
  const { collections, count, isError, error, isLoading } = useCollections(
    {
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const filters = useCollectionTableFilters()
  const columns = useCollectionTableColumns()

  const { table } = useDataTable({
    data: collections ?? [],
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
        <Heading>{t("collections.domain")}</Heading>
        <Link to="/collections/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        filters={filters}
        orderBy={["title", "handle", "created_at", "updated_at"]}
        search
        navigateTo={(row) => `/collections/${row.original.id}`}
        queryObject={raw}
        isLoading={isLoading}
      />
    </Container>
  )
}
