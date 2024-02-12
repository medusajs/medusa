import { PencilSquare, Trash } from "@medusajs/icons"
import type { Product } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  Table,
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
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

import {
  ProductAvailabilityCell,
  ProductCollectionCell,
  ProductStatusCell,
  ProductTitleCell,
  ProductVariantCell,
} from "../../../../../components/common/product-table-cells"

import { ActionMenu } from "../../../../../components/common/action-menu"
import { LocalizedTablePagination } from "../../../../../components/localization/localized-table-pagination"
import { productsLoader } from "../../loader"

const PAGE_SIZE = 50

export const ProductListTable = () => {
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
    <Container className="overflow-hidden p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("products.domain")}</Heading>
        <Button size="small" variant="secondary">
          {t("actions.create")}
        </Button>
      </div>
      <div>
        <Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th:last-of-type]:w-[1%] [&_th:last-of-type]:whitespace-nowrap"
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
            label={t("actions.delete")}
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const ProductActions = ({ id }: { id: string }) => {
  const { t } = useTranslation()
  const { mutateAsync } = useAdminDeleteProduct(id)

  const handleDelete = async () => {
    await mutateAsync()
  }

  return (
    <ActionMenu
      groups={[
        {
          actions: [
            {
              icon: <PencilSquare />,
              label: t("actions.edit"),
              to: `/products/${id}/edit`,
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
        cell: ({ row }) => {
          return <ProductTitleCell product={row.original} />
        },
      }),
      columnHelper.accessor("collection", {
        header: t("fields.collection"),
        cell: (cell) => {
          const collection = cell.getValue()

          return <ProductCollectionCell collection={collection} />
        },
      }),
      columnHelper.accessor("sales_channels", {
        header: t("fields.availability"),
        cell: (cell) => {
          const salesChannels = cell.getValue()

          return <ProductAvailabilityCell salesChannels={salesChannels ?? []} />
        },
      }),
      columnHelper.accessor("variants", {
        header: t("fields.inventory"),
        cell: (cell) => {
          const variants = cell.getValue()

          return <ProductVariantCell variants={variants} />
        },
      }),
      columnHelper.accessor("status", {
        header: t("fields.status"),
        cell: (cell) => {
          const value = cell.getValue()

          return <ProductStatusCell status={value} />
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
