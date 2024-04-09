import { Button, Container, Heading } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../../components/table/data-table"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { useShippingProfilesTableColumns } from "./use-shipping-profiles-table-columns"
import { useShippingProfilesTableQuery } from "./use-shipping-profiles-table-query"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { useShippingProfiles } from "../../../../../hooks/api/shipping-profiles"

const PAGE_SIZE = 20

export const ShippingProfileListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useShippingProfilesTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { shipping_profiles, count, isLoading, isError, error } =
    useShippingProfiles({
      ...searchParams,
    })

  const columns = useShippingProfilesTableColumns()

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

  const noData = !isLoading && !shipping_profiles.length

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("shippingProfile.domain")}</Heading>
        <div>
          <Button size="small" variant="secondary" asChild>
            <Link to="create">{t("actions.create")}</Link>
          </Button>
        </div>
      </div>
      {noData ? (
        <NoRecords className="h-[180px]" title={t("general.noRecordsFound")} />
      ) : (
        <DataTable
          table={table}
          pageSize={PAGE_SIZE}
          count={count || 1}
          columns={columns}
          navigateTo={(row) => row.id}
          isLoading={isLoading}
          queryObject={raw}
          pagination
        />
      )}
    </Container>
  )
}
