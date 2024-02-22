import { Button, Container, Heading } from "@medusajs/ui"
import { useAdminGiftCards } from "medusa-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useGiftCardTableColumns } from "./use-gift-card-table-columns"
import { useGiftCardTableFilters } from "./use-gift-card-table-filters"
import { useGiftCardTableQuery } from "./use-gift-card-table-query"

const PAGE_SIZE = 20

export const GiftCardListTable = () => {
  const { t } = useTranslation()
  const { searchParams, raw } = useGiftCardTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { gift_cards, count, isError, error, isLoading } = useAdminGiftCards(
    {
      ...searchParams,
    },
    {
      keepPreviousData: true,
    }
  )

  const filters = useGiftCardTableFilters()
  const columns = useGiftCardTableColumns()

  const { table } = useDataTable({
    data: gift_cards ?? [],
    columns,
    enablePagination: true,
    count,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("giftCards.domain")}</Heading>
        <div className="flex items-center gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        table={table}
        pagination
        navigateTo={(row) => `/gift-cards/${row.original.id}`}
        filters={filters}
        count={count}
        search
        isLoading={isLoading}
        pageSize={PAGE_SIZE}
        orderBy={["created_at", "updated_at"]}
        queryObject={raw}
      />
    </Container>
  )
}
