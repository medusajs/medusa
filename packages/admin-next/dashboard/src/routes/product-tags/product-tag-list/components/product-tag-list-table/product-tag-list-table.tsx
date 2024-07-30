import { Button, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useProductTags } from "../../../../../hooks/api"
import { useProductTagTableColumns } from "../../../../../hooks/table/columns"
import { useProductTagTableFilters } from "../../../../../hooks/table/filters"
import { useProductTagTableQuery } from "../../../../../hooks/table/query"
import { useDataTable } from "../../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const ProductTagListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useProductTagTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { product_tags, count, isPending, isError, error } =
    useProductTags(searchParams)

  const columns = useProductTagTableColumns()
  const filters = useProductTagTableFilters()

  const { table } = useDataTable({
    data: product_tags,
    count,
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
        <Heading>{t("productTags.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="create">{t("actions.create")}</Link>
        </Button>
      </div>
      <DataTable
        table={table}
        filters={filters}
        queryObject={raw}
        isLoading={isPending}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        navigateTo={(row) => row.original.id}
        search
        pagination
        orderBy={["value", "created_at", "updated_at"]}
      />
    </Container>
  )
}
