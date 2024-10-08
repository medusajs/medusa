import { Button, Container, Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useShippingProfiles } from "../../../../../hooks/api/shipping-profiles"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useShippingProfileTableColumns } from "./use-shipping-profile-table-columns"
import { useShippingProfileTableFilters } from "./use-shipping-profile-table-filters"
import { useShippingProfileTableQuery } from "./use-shipping-profile-table-query"

const PAGE_SIZE = 20

export const ShippingProfileListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useShippingProfileTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { shipping_profiles, count, isLoading, isError, error } =
    useShippingProfiles(searchParams, {
      placeholderData: keepPreviousData,
    })

  const columns = useShippingProfileTableColumns()
  const filters = useShippingProfileTableFilters()

  const { table } = useDataTable({
    data: shipping_profiles,
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
        <div>
          <Heading>{t("shippingProfile.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("shippingProfile.subtitle")}
          </Text>
        </div>
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
        orderBy={["name", "type", "created_at", "updated_at"]}
        isLoading={isLoading}
        navigateTo={(row) => row.id}
        queryObject={raw}
        search
        pagination
      />
    </Container>
  )
}
