import { PencilSquare, Trash, XCircle } from "@medusajs/icons"
import { PublishableApiKey } from "@medusajs/medusa"
import {
  Button,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Table,
  Text,
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
import { format } from "date-fns"
import {
  useAdminDeletePublishableApiKey,
  useAdminPublishableApiKeys,
  useAdminRevokePublishableApiKey,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"

const PAGE_SIZE = 50

export const ApiKeyManagementListTable = () => {
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

  const { publishable_api_keys, count, isLoading, isError, error } =
    useAdminPublishableApiKeys({})

  const columns = useColumns()

  const table = useReactTable({
    data: publishable_api_keys || [],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    getRowId: (row) => row.id,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  const { t } = useTranslation()
  const navigate = useNavigate()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("apiKeyManagement.domain")}</Heading>
        <Link to="create">
          <Button variant="secondary" size="small">
            {t("actions.create")}
          </Button>
        </Link>
      </div>
      <div>
        {(publishable_api_keys?.length ?? 0) > 0 ? (
          <div>
            <Table>
              <Table.Header className="border-t-0">
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap [&_th]:w-1/4"
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
                      navigate(
                        `/settings/api-key-management/${row.original.id}`
                      )
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
          </div>
        ) : (
          <NoRecords
            action={{
              label: t("apiKeyManagement.createKey"),
              to: "create",
            }}
          />
        )}
      </div>
    </Container>
  )
}

const KeyActions = ({ apiKey }: { apiKey: PublishableApiKey }) => {
  const { mutateAsync: revokeAsync } = useAdminRevokePublishableApiKey(
    apiKey.id
  )
  const { mutateAsync: deleteAsync } = useAdminDeletePublishableApiKey(
    apiKey.id
  )

  const { t } = useTranslation()
  const prompt = usePrompt()

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.deleteKeyWarning", {
        title: apiKey.title,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await deleteAsync()
  }

  const handleRevoke = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("apiKeyManagement.revokeKeyWarning", {
        title: apiKey.title,
      }),
      confirmText: t("apiKeyManagement.revoke"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await revokeAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/settings/api-key-management/${apiKey.id}`,
            },
          ],
        },
        {
          actions: [
            {
              icon: <XCircle />,
              label: t("apiKeyManagement.revoke"),
              onClick: handleRevoke,
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

const columnHelper = createColumnHelper<PublishableApiKey>()

const useColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("id", {
        header: "Key",
        cell: ({ getValue }) => {
          const token = getValue()

          return (
            <div
              className="bg-ui-bg-subtle border-ui-border-base box-border flex w-fit max-w-[220px] cursor-default items-center gap-x-0.5 overflow-hidden rounded-full border pl-2 pr-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Text size="xsmall" leading="compact" className="truncate">
                {token}
              </Text>
              <Copy
                content={token}
                variant="mini"
                className="text-ui-fg-subtle"
              />
            </div>
          )
        },
      }),
      columnHelper.accessor("revoked_at", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const revokedAt = getValue()

          return (
            <StatusBadge color={revokedAt ? "red" : "green"}>
              {revokedAt ? t("general.revoked") : t("general.active")}
            </StatusBadge>
          )
        },
      }),
      columnHelper.accessor("created_at", {
        header: t("fields.created"),
        cell: ({ getValue }) => {
          const date = getValue()

          return format(new Date(date), "dd MMM, yyyy")
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <KeyActions apiKey={row.original} />
        },
      }),
    ],
    [t]
  )

  return columns
}
