import { PencilSquare, Trash } from "@medusajs/icons"
import { PublishableApiKey, SalesChannel } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  StatusBadge,
  Table,
  clx,
  usePrompt,
} from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  useAdminPublishableApiKeySalesChannels,
  useAdminRemovePublishableKeySalesChannelsBatch,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import {
  NoRecords,
  NoResults,
} from "../../../../../components/common/empty-table-content"
import { Query } from "../../../../../components/filtering/query"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { useQueryParams } from "../../../../../hooks/use-query-params"

type ApiKeySalesChannelSectionProps = {
  apiKey: PublishableApiKey
}

const PAGE_SIZE = 10

export const ApiKeySalesChannelSection = ({
  apiKey,
}: ApiKeySalesChannelSectionProps) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const prompt = usePrompt()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const params = useQueryParams(["q"])
  const { sales_channels, isLoading, isError, error } =
    useAdminPublishableApiKeySalesChannels(
      apiKey.id,
      {
        ...params,
      },
      {
        keepPreviousData: true,
      }
    )

  const count = sales_channels?.length || 0

  const columns = useColumns()

  const table = useReactTable({
    data: sales_channels ?? [],
    columns,
    pageCount: Math.ceil(count / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    meta: {
      apiKey: apiKey.id,
    },
  })

  const { mutateAsync } = useAdminRemovePublishableKeySalesChannelsBatch(
    apiKey.id
  )

  const handleRemove = async () => {
    const keys = Object.keys(rowSelection).filter((k) => rowSelection[k])

    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.removeSalesChannelsWarning", {
        count: keys.length,
      }),
      confirmText: t("actions.continue"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        sales_channel_ids: keys.map((k) => ({ id: k })),
      },
      {
        onSuccess: () => {
          setRowSelection({})
        },
      }
    )
  }

  const noRecords = !isLoading && !sales_channels?.length && !params.q

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("salesChannels.domain")}</Heading>
        <Button variant="secondary" size="small" asChild>
          <Link to="add-sales-channels">{t("general.add")}</Link>
        </Button>
      </div>
      {!noRecords && (
        <div className="flex items-center justify-between px-6 py-4">
          <div></div>
          <div className="flex items-center gap-x-2">
            <Query />
          </div>
        </div>
      )}
      {noRecords ? (
        <NoRecords />
      ) : (
        <div>
          {!isLoading && sales_channels?.length !== 0 ? (
            <Table>
              <Table.Header className="border-t-0">
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/3"
                    >
                      {headerGroup.headers.map((header) => {
                        return (
                          <Table.HeaderCell key={header.id}>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Table.HeaderCell>
                        )
                      })}
                    </Table.Row>
                  )
                })}
              </Table.Header>
              <Table.Body className="border-b-0">
                {table.getRowModel().rows.map((row) => (
                  <Table.Row
                    key={row.id}
                    className={clx(
                      "transition-fg cursor-pointer [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                      {
                        "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                          row.getIsSelected(),
                      }
                    )}
                    onClick={() =>
                      navigate(`/settings/sales-channels/${row.original.id}`)
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <Table.Cell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <NoResults />
          )}
          <LocalizedTablePagination
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            count={count ?? 0}
            pageIndex={pageIndex}
            pageCount={table.getPageCount()}
            pageSize={PAGE_SIZE}
          />
          <CommandBar open={!!Object.keys(rowSelection).length}>
            <CommandBar.Bar>
              <CommandBar.Value>
                {t("general.countSelected", {
                  count: Object.keys(rowSelection).length,
                })}
              </CommandBar.Value>
              <CommandBar.Seperator />
              <CommandBar.Command
                action={handleRemove}
                shortcut="r"
                label={t("actions.remove")}
              />
            </CommandBar.Bar>
          </CommandBar>
        </div>
      )}
    </Container>
  )
}

const SalesChannelActions = ({
  salesChannel,
  apiKey,
}: {
  salesChannel: SalesChannel
  apiKey: string
}) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminRemovePublishableKeySalesChannelsBatch(apiKey)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.removeSalesChannelWarning"),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync({
      sales_channel_ids: [{ id: salesChannel.id }],
    })
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

const columnHelper = createColumnHelper<SalesChannel>()

const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
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
      columnHelper.accessor("name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("description", {
        header: t("fields.description"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("is_disabled", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const value = getValue()
          return (
            <div>
              <StatusBadge color={value ? "grey" : "green"}>
                {value ? t("general.disabled") : t("general.enabled")}
              </StatusBadge>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row, table }) => {
          const { apiKey } = table.options.meta as {
            apiKey: string
          }

          return (
            <SalesChannelActions salesChannel={row.original} apiKey={apiKey} />
          )
        },
      }),
    ],
    [t]
  )
}
