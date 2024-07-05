import { PencilSquare, Trash } from "@medusajs/icons"
import { SalesChannelDTO } from "@medusajs/types"
import {
  Button,
  Container,
  Heading,
  toast,
  usePrompt,
  Text,
} from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { ActionMenu } from "../../../../components/common/action-menu"
import { DataTable } from "../../../../components/table/data-table"
import {
  useDeleteSalesChannel,
  useSalesChannels,
} from "../../../../hooks/api/sales-channels"
import { useSalesChannelTableColumns } from "../../../../hooks/table/columns/use-sales-channel-table-columns"
import { useSalesChannelTableQuery } from "../../../../hooks/table/query/use-sales-channel-table-query"
import { useDataTable } from "../../../../hooks/use-data-table"

const PAGE_SIZE = 20

export const SalesChannelListTable = () => {
  const { t } = useTranslation()

  const { raw, searchParams } = useSalesChannelTableQuery({
    pageSize: PAGE_SIZE,
  })
  const {
    sales_channels,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useSalesChannels(searchParams, {
    placeholderData: keepPreviousData,
  })

  const columns = useColumns()

  const { table } = useDataTable({
    data: sales_channels ?? [],
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
          <Heading level="h2">{t("salesChannels.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("salesChannels.subtitle")}
          </Text>
        </div>
        <Link to="/settings/sales-channels/create">
          <Button size="small" variant="secondary">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <DataTable
        table={table}
        columns={columns}
        count={count}
        pageSize={PAGE_SIZE}
        pagination
        search
        navigateTo={(row) => row.id}
        isLoading={isLoading}
        queryObject={raw}
        orderBy={["name", "created_at", "updated_at"]}
      />
    </Container>
  )
}

const SalesChannelActions = ({
  salesChannel,
}: {
  salesChannel: SalesChannelDTO
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()
  const { mutateAsync } = useDeleteSalesChannel(salesChannel.id)

  const handleDelete = async () => {
    const confirm = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.deleteSalesChannelWarning", {
        name: salesChannel.name,
      }),
      verificationInstruction: t("general.typeToConfirm"),
      verificationText: salesChannel.name,
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!confirm) {
      return
    }

    try {
      await mutateAsync()
      toast.success(t("general.success"), {
        description: t("salesChannels.toast.delete"),
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
          ],
        },
        {
          actions: [
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
        cell: ({ row }) => {
          return <SalesChannelActions salesChannel={row.original} />
        },
      }),
    ],
    [base]
  )
}
