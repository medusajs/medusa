import { PencilSquare, Trash } from "@medusajs/icons"
import { SalesChannelDTO } from "@medusajs/types"
import { Button, Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { createColumnHelper } from "@tanstack/react-table"
import { useAdminRemoveLocationFromSalesChannel } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { DataTable } from "../../../../../components/table/data-table"
import { useSalesChannelTableColumns } from "../../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { ExtendedStockLocationDTO } from "../../../../../types/api-responses"

type LocationSalesChannelSectionProps = {
  location: ExtendedStockLocationDTO
}

const PAGE_SIZE = 10

export const LocationSalesChannelSection = ({
  location,
}: LocationSalesChannelSectionProps) => {
  const { t } = useTranslation()

  const salesChannels = location.sales_channels
  const count = location.sales_channels?.length || 0
  const columns = useColumns()

  const { table } = useDataTable({
    data: salesChannels ?? [],
    columns,
    count,
    pageSize: PAGE_SIZE,
    enablePagination: true,
    getRowId: (row) => row.id,
  })

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("salesChannels.domain")}</Heading>
        <Link to={"add-sales-channels"}>
          <Button size="small" variant="secondary">
            {t("locations.addSalesChannels")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        pageSize={PAGE_SIZE}
        count={count}
        columns={columns}
        navigateTo={(row) => row.id}
        pagination
      />
    </Container>
  )
}

const SalesChannelActions = ({
  salesChannel,
  locationId,
}: {
  salesChannel: SalesChannelDTO
  locationId: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminRemoveLocationFromSalesChannel()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("locations.removeSalesChannelsWarning", { count: 1 }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    try {
      await mutateAsync({
        location_id: locationId,
        sales_channel_id: salesChannel.id,
      })

      toast.success(t("general.success"), {
        description: t("locations.toast.removeChannel"),
        dismissLabel: t("actions.close"),
      })
    } catch (e) {
      toast.error(t("general.error"), {
        description: e.message,
        dismissLabel: t("actions.close"),
      })
    }
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/sales-channels/${salesChannel.id}/edit`,
            },
            {
              icon: <Trash />,
              label: t("actions.delete"),
              onClick: handleDelete,
            },
          ],
        },
      ]}
    />
  )
}

const columnHelper = createColumnHelper<SalesChannelDTO>()

const useColumns = () => {
  const base = useSalesChannelTableColumns()

  return useMemo(
    () => [
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { locationId } = table.options.meta as {
            locationId: string
          }

          return (
            <SalesChannelActions
              salesChannel={row.original}
              locationId={locationId}
            />
          )
        },
      }),
    ],
    [base]
  )
}
