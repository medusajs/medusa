import type { Product } from "@medusajs/medusa"
import {
  Checkbox,
  CommandBar,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Table,
  Text,
  clx,
} from "@medusajs/ui"
import {
  PaginationState,
  RowSelectionState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminDeleteProduct, useAdminProducts } from "medusa-react"
import { useMemo, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

import { Thumbnail } from "../../../../components/common/thumbnail"
import { productsLoader } from "./loader"

import { EllipsisVertical, Trash } from "@medusajs/icons"
import after from "medusa-admin:widgets/product/list/after"
import before from "medusa-admin:widgets/product/list/before"
import { useTranslation } from "react-i18next"

const PAGE_SIZE = 50

export const ProductList = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof productsLoader>>
  >

  const { products, count } = useAdminProducts(
    {
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
    },
    {
      initialData,
    }
  )

  const columns = useColumns()

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const table = useReactTable({
    data: (products ?? []) as Product[],
    columns,
    pageCount: Math.ceil((count ?? 0) / PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <div className="flex flex-col gap-y-2">
      {before.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
      <Container className="overflow-hidden p-0">
        <div className="px-8 pb-4 pt-6">
          <Heading>{t("products.domain")}</Heading>
        </div>
        <div>
          <Table>
            <Table.Header>
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
                  onClick={() => navigate(`/products/${row.original.id}`)}
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
          <Table.Pagination
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
        <CommandBar open={!!Object.keys(rowSelection).length}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: Object.keys(rowSelection).length,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            <CommandBar.Command
              action={() => {
                console.log("Delete")
              }}
              shortcut="d"
              label={t("general.delete")}
            />
          </CommandBar.Bar>
        </CommandBar>
      </Container>
      {after.widgets.map((w, i) => (
        <w.Component key={i} />
      ))}
    </div>
  )
}

const ProductActions = ({ id }: { id: string }) => {
  const { mutateAsync } = useAdminDeleteProduct(id)

  const handleDelete = async () => {
    await mutateAsync()
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
        <IconButton variant="transparent">
          <EllipsisVertical />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onClick={handleDelete}>
          <div className="flex items-center gap-x-2">
            <Trash />
            <span>Delete</span>
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumns = () => {
  const { t } = useTranslation()

  const columns = useMemo(
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
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: (cell) => {
          const title = cell.getValue()
          const thumbnail = cell.row.original.thumbnail

          return (
            <div className="flex items-center gap-x-3">
              <Thumbnail src={thumbnail} alt={`Thumbnail image of ${title}`} />
              <Text size="small" className="text-ui-fg-base">
                {title}
              </Text>
            </div>
          )
        },
      }),
      columnHelper.accessor("variants", {
        header: t("products.variants"),
        cell: (cell) => {
          const variants = cell.getValue()

          return (
            <Text size="small" className="text-ui-fg-base">
              {variants.length}
            </Text>
          )
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return <ProductActions id={row.original.id} />
        },
      }),
    ],
    [t]
  )

  return columns
}
