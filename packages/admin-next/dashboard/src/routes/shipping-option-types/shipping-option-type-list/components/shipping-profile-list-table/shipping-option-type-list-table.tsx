import { Button, Container, Heading } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useShippingOptionTypeTableColumns } from "./use-shipping-option-type-table-columns"
import { useShippingOptionTypeTableFilters } from "./use-shipping-option-type-table-filters"
import { useShippingOptionTypeTableQuery } from "./use-shipping-option-type-table-query"
import { useShippingOptionTypes } from "../../../../../hooks/api/shipping-option-types"

const PAGE_SIZE = 20

export const ShippingOptionTypeListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useShippingOptionTypeTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { shipping_option_types, count, isLoading, isError, error } = {} // TODO
  // useShippingOptionTypes(searchParams, {
  //   placeholderData: keepPreviousData,
  // })

  const columns = useShippingOptionTypeTableColumns()
  const filters = useShippingOptionTypeTableFilters()

  const { table } = useDataTable({
    data: shipping_option_types,
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
        <Heading>{t("shippingOptionType.domain")}</Heading>
        <div>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      <DataTable
        table={table}
        pageSize={PAGE_SIZE}
        count={count}
        columns={columns}
        filters={filters}
        orderBy={["label", "created_at", "updated_at"]}
        isLoading={isLoading}
        navigateTo={(row) => row.id}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}
