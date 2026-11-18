import { PencilSquare, Trash } from "@medusajs/icons"
import {
  Button,
  Checkbox,
  Container,
  Heading,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { RowSelectionState, createColumnHelper } from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { HttpTypes, SalesChannelDTO } from "@medusajs/types"
import { keepPreviousData } from "@tanstack/react-query"
import {
  ActionGroup,
  ActionMenu,
} from "../../../../../components/common/action-menu"
import { _DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useSalesChannelRemoveProducts } from "../../../../../hooks/api/sales-channels"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import {
  useProductPermissions,
  useSalesChannelPermissions,
} from "../../../../../hooks/use-resource-permissions"

const PAGE_SIZE = 10

type SalesChannelProductSectionProps = {
  salesChannel: SalesChannelDTO
}

export const SalesChannelProductSection = ({
  salesChannel,
}: SalesChannelProductSectionProps) => {
  const { canUpdate: canUpdateSalesChannel } = useSalesChannelPermissions()
  const { canUpdate: canUpdateProduct } = useProductPermissions()
  const canUpdate = canUpdateSalesChannel && canUpdateProduct
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { searchParams, raw } = useProductTableQuery({ pageSize: PAGE_SIZE })
  const {
    products,
    count,
    isPending: isLoading,
    isError,
    error,
  } = useProducts(
    {
      ...searchParams,
      sales_channel_id: [salesChannel.id],
    },
    {
      placeholderData: keepPreviousData,
    }
  )

  const columns = useColumns(canUpdate)
  const filters = useProductTableFilters(["sales_channel_id"])

  const { table } = useDataTable({
    data: products ?? [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: canUpdate,
    pageSize: PAGE_SIZE,
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater: setRowSelection,
    },
    meta: {
      salesChannelId: salesChannel.id,
    },
  })

  const { mutateAsync } = useSalesChannelRemoveProducts(salesChannel.id)

  const prompt = usePrompt()
  const { t } = useTranslation()

  const handleRemove = async () => {
    const ids = Object.keys(rowSelection)

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.removeProductsWarning", {
        count: ids.length,
        sales_channel: salesChannel.name,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(ids, {
      onSuccess: () => {
        toast.success(t("salesChannels.toast.update"))
        setRowSelection({})
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        {canUpdate && (
          <Link
            to={`/settings/sales-channels/${salesChannel.id}/add-products`}
          >
            <Button size="small" variant="secondary">
              {t("general.add")}
            </Button>
          </Link>
        )}
      </div>
      <_DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        commands={
          canUpdate
            ? [
                {
                  action: handleRemove,
                  label: t("actions.remove"),
                  shortcut: "r",
                },
              ]
            : []
        }
        count={count}
        pagination
        search
        filters={filters}
        navigateTo={(row) => `/products/${row.id}`}
        isLoading={isLoading}
        orderBy={[
          { key: "title", label: t("fields.title") },
          { key: "status", label: t("fields.status") },
          { key: "created_at", label: t("fields.createdAt") },
          { key: "updated_at", label: t("fields.updatedAt") },
        ]}
        queryObject={raw}
        noRecords={{
          message: t("salesChannels.products.list.noRecordsMessage"),
        }}
      />
    </Container>
  )
}

const columnHelper = createColumnHelper<HttpTypes.AdminProduct>()

const useColumns = (canUpdate: boolean) => {
  const base = useProductTableColumns()

  return useMemo(
    () => [
      ...(canUpdate
        ? [
            columnHelper.display({
              id: "select",
              header: ({ table }) => {
                return (
                  <Checkbox
                    checked={
                      table.getIsSomePageRowsSelected()
                        ? "indeterminate"
                        : table.getIsAllPageRowsSelected()
                    }
                    onCheckedChange={(value) =>
                      table.toggleAllPageRowsSelected(!!value)
                    }
                  />
                )
              },
              cell: ({ row }) => {
                return (
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  />
                )
              },
            }),
          ]
        : []),
      ...base,
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { salesChannelId } = table.options.meta as {
            salesChannelId: string
          }

          return (
            <ProductListCellActions
              productId={row.original.id}
              salesChannelId={salesChannelId}
              canUpdate={canUpdate}
            />
          )
        },
      }),
    ],
    [base, canUpdate]
  )
}

const ProductListCellActions = ({
  salesChannelId,
  productId,
  canUpdate,
}: {
  productId: string
  salesChannelId: string
  canUpdate: boolean
}) => {
  const { t } = useTranslation()

  const { mutateAsync } = useSalesChannelRemoveProducts(salesChannelId)

  const onRemove = async () => {
    await mutateAsync([productId], {
      onSuccess: () => {
        toast.success(t("salesChannels.toast.update"))
      },
      onError: (e) => {
        toast.error(e.message)
      },
    })
  }

  const groups: ActionGroup[] = [
    {
      actions: [
        {
          icon: <PencilSquare />,
          label: t("actions.edit"),
          to: `/products/${productId}`,
        },
      ],
    },
  ]

  if (canUpdate) {
    groups.push({
      actions: [
        {
          icon: <Trash />,
          label: t("actions.remove"),
          onClick: onRemove,
        },
      ],
    })
  }

  return <ActionMenu groups={groups} />
}
