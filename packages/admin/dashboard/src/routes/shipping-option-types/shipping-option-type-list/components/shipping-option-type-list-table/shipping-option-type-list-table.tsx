import { HttpTypes } from "@medusajs/types"
import { Button, Container, Heading, Text } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { _DataTable } from "../../../../../components/table/data-table"
import { useShippingOptionTypes } from "../../../../../hooks/api"
import { useShippingOptionTypeTableColumns } from "../../../../../hooks/table/columns/use-shipping-option-type-table-columns"
import { useShippingOptionTypeTableFilters } from "../../../../../hooks/table/filters/use-shipping-option-type-table-filters"
import { useShippingOptionTypeTableQuery } from "../../../../../hooks/table/query/use-shipping-option-type-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useShippingOptionTypePermissions } from "../../../../../hooks/use-resource-permissions"
import { ShippingOptionTypeRowActions } from "./shipping-option-type-table-row-actions"

const PAGE_SIZE = 20

export const ShippingOptionTypeListTable = () => {
  const { t } = useTranslation()
  const { canCreate } = useShippingOptionTypePermissions()

  const { searchParams, raw } = useShippingOptionTypeTableQuery({
    pageSize: PAGE_SIZE,
  })
  const { shipping_option_types, count, isLoading, isError, error } =
    useShippingOptionTypes(searchParams, {
      placeholderData: keepPreviousData,
    })

  const filters = useShippingOptionTypeTableFilters()
  const columns = useColumns()

  const { table } = useDataTable({
    columns,
    data: shipping_option_types,
    count,
    getRowId: (row) => row.id,
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("shippingOptionTypes.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("shippingOptionTypes.subtitle")}
          </Text>
        </div>
        {canCreate && (
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        )}
      </div>
      <_DataTable
        table={table}
        filters={filters}
        isLoading={isLoading}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        orderBy={[
          { key: "label", label: t("fields.label") },
          { key: "code", label: t("fields.code") },
          { key: "description", label: t("fields.description") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        navigateTo={({ original }) => original.id}
        queryObject={raw}
        pagination
        search
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminShippingOptionType>()

const useColumns = () => {
  const base = useShippingOptionTypeTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <ShippingOptionTypeRowActions shippingOptionType={row.original} />
          )
        },
      }),
    ],
    [base]
  )
}
