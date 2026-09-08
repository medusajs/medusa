import { HttpTypes } from "@medusajs/types"
import { Container, createDataTableColumnHelper } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { DataTable } from "../../../../components/data-table"
import * as hooks from "../../../../components/data-table/helpers/sales-channels"
import { useStore } from "../../../../hooks/api"
import { useSalesChannels } from "../../../../hooks/api/sales-channels"
import { SalesChannelListTableActions } from "./sales-channel-list-table-actions"

type SalesChannelWithIsDefault = HttpTypes.AdminSalesChannel & {
  is_default?: boolean
}

const PAGE_SIZE = 20

export const SalesChannelListTable = () => {
  const { t } = useTranslation()

  const { store } = useStore()

  const searchParams = hooks.useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })

  const { sales_channels, count, isPending, isError, error } = useSalesChannels(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns()
  const filters = hooks.useSalesChannelTableFilters()
  const emptyState = hooks.useSalesChannelTableEmptyState()

  const sales_channels_data: SalesChannelWithIsDefault[] =
    sales_channels?.map((sales_channel) => {
      return {
        ...sales_channel,
        is_default: store?.default_sales_channel_id === sales_channel.id,
      }
    }) ?? []

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0">
      <DataTable
        data={sales_channels_data}
        columns={columns}
        rowCount={count}
        getRowId={(row) => row.id}
        pageSize={PAGE_SIZE}
        filters={filters}
        isLoading={isPending}
        emptyState={emptyState}
        heading={t("salesChannels.domain")}
        subHeading={t("salesChannels.subtitle")}
        action={{
          label: t("actions.create"),
          to: "/settings/sales-channels/create",
        }}
        rowHref={(row) => `/settings/sales-channels/${row.id}`}
      />
    </Container>
  )
}

const columnHelper = createDataTableColumnHelper<
  HttpTypes.AdminSalesChannel & { is_default?: boolean }
>()

const useColumns = () => {
  const base = hooks.useSalesChannelTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "action",
        cell: ({ row }) => (
          <SalesChannelListTableActions salesChannel={row.original} />
        ),
      }),
    ],
    [base]
  )
}
