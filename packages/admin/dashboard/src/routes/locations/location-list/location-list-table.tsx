import { Container } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

import { DataTable } from "../../../components/data-table"
import { useStockLocations } from "../../../hooks/api/stock-locations"
import { LOCATION_LIST_FIELDS } from "./constants"
import { useLocationListTableColumns } from "./use-location-list-table-columns"
import { useLocationListTableQuery } from "./use-location-list-table-query"

const PAGE_SIZE = 20
const PREFIX = "loc"

export const LocationListTable = () => {
  const { t } = useTranslation()

  const searchParams = useLocationListTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })

  const {
    stock_locations: stockLocations = [],
    count,
    isError,
    error,
    isLoading,
  } = useStockLocations(
    {
      fields: LOCATION_LIST_FIELDS,
      ...searchParams,
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useLocationListTableColumns()

  if (isError) {
    throw error
  }

  return (
    <Container className="flex flex-col divide-y p-0">
      <DataTable
        data={stockLocations}
        columns={columns}
        rowCount={count}
        pageSize={PAGE_SIZE}
        getRowId={(row) => row.id}
        heading={t("stockLocations.domain")}
        subHeading={t("stockLocations.list.description")}
        emptyState={{
          empty: {
            heading: t("stockLocations.list.noRecordsMessage"),
            description: t("stockLocations.list.noRecordsMessageEmpty"),
          },
          filtered: {
            heading: t("stockLocations.list.noRecordsMessage"),
            description: t("stockLocations.list.noRecordsMessageFiltered"),
          },
        }}
        actions={[
          {
            label: t("actions.create"),
            to: "create",
          },
        ]}
        isLoading={isLoading}
        rowHref={(row) => `/settings/locations/${row.id}`}
        enableSearch={true}
        prefix={PREFIX}
        layout="fill"
      />
    </Container>
  )
}
