import { User } from "@medusajs/medusa"
import { Checkbox, Container, Heading, Table, clx } from "@medusajs/ui"
import {
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminUsers } from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

export const UserListTable = () => {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { users, isLoading, isError, error } = useAdminUsers()

  const columns = useColumns()

  const table = useReactTable({
    data: users ?? [],
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  })

  const { t } = useTranslation()
  const navigate = useNavigate()

  if (isError) {
    throw error
  }

  return (
    <Container className="p-0 divide-y">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("users.domain")}</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Table.Row
                key={headerGroup.id}
                className="[&_th]:w-1/3 [&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
              onClick={() => navigate(row.original.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="px-6 py-4"></div>
    </Container>
  )
}

const columnHelper = createColumnHelper<Omit<User, "password_hash">>()

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
      columnHelper.display({
        id: "name",
        header: t("fields.name"),
        cell: ({ row }) => {
          const { first_name, last_name } = row.original

          if (!first_name && !last_name) {
            return <span className="text-ui-fg-muted">-</span>
          }

          return `${first_name || ""} ${last_name || ""}`.trim()
        },
      }),
      columnHelper.accessor("email", {
        header: t("fields.email"),
        cell: ({ row }) => {
          return row.original.email
        },
      }),
      columnHelper.accessor("role", {
        header: t("users.role"),
        cell: ({ row }) => {
          return t(`users.roles.${row.original.role}`)
        },
      }),
    ],
    [t]
  )
}
