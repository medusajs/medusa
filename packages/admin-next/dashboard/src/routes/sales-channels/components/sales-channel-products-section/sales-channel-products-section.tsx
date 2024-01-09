import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Product, SalesChannel } from "@medusajs/medusa"
import {
  Button,
  Checkbox,
  CommandBar,
  Container,
  DropdownMenu,
  FocusModal,
  Heading,
  IconButton,
  Table,
  Tooltip,
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
  adminProductKeys,
  useAdminAddProductsToSalesChannel,
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import * as zod from "zod"

import { DebouncedSearch } from "../../../../components/common/debounced-search"
import {
  ProductAvailabilityCell,
  ProductCollectionCell,
  ProductInventoryCell,
  ProductStatusCell,
  ProductTitleCell,
} from "../../../../components/common/product-table-cells"
import { queryClient } from "../../../../lib/medusa"

const PAGE_SIZE = 10

type Props = {
  salesChannel: SalesChannel
}

export const SalesChannelProductsSection = ({ salesChannel }: Props) => {
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

  const [query, setQuery] = useState("")
  const { products, count, isLoading } = useAdminProducts(
    {
      sales_channel_id: [salesChannel.id],
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
      q: query,
    },
    {
      keepPreviousData: true,
    }
  )

  const columns = useListColumns(salesChannel.id)

  const table = useReactTable({
    data: (products ?? []) as Product[],
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

  const { mutateAsync } = useAdminDeleteProductsFromSalesChannel(
    salesChannel.id
  )
  const prompt = usePrompt()

  const { t } = useTranslation()

  const onRemove = async () => {
    const ids = Object.keys(rowSelection).map((k) => ({ id: k }))

    const result = await prompt({
      title: t("general.areYouSure"),
      description: t("salesChannels.removeProductsWarning", {
        count: ids.length,
        sales_channel: salesChannel.name,
      }),
      confirmText: t("general.delete"),
      cancelText: t("general.cancel"),
    })

    if (!result) {
      return
    }

    await mutateAsync(
      {
        product_ids: ids,
      },
      {
        onSuccess: () => {
          setRowSelection({})
          queryClient.invalidateQueries(adminProductKeys.lists())
        },
      }
    )
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <Heading level="h2">{t("products.domain")}</Heading>
        <div className="flex items-center gap-x-2">
          <DebouncedSearch size="small" value={query} onChange={setQuery} />
          <AddProductsModal salesChannelId={salesChannel.id} />
        </div>
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
                  "transition-fg [&_td:last-of-type]:w-[1%] [&_td:last-of-type]:whitespace-nowrap",
                  {
                    "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                      row.getIsSelected(),
                  }
                )}
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
        <CommandBar open={!!Object.keys(rowSelection).length}>
          <CommandBar.Bar>
            <CommandBar.Value>
              {t("general.countSelected", {
                count: Object.keys(rowSelection).length,
              })}
            </CommandBar.Value>
            <CommandBar.Seperator />
            <CommandBar.Command
              action={onRemove}
              shortcut="r"
              label={t("general.remove")}
            />
          </CommandBar.Bar>
        </CommandBar>
      </div>
    </Container>
  )
}

const listColumnHelper = createColumnHelper<Product>()

const useListColumns = (id: string) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      listColumnHelper.display({
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
      listColumnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ row }) => {
          const product = row.original

          return <ProductTitleCell product={product} />
        },
      }),
      listColumnHelper.accessor("variants", {
        header: t("fields.inventory"),
        cell: (cell) => {
          const variants = cell.getValue()

          return <ProductInventoryCell variants={variants} />
        },
      }),
      listColumnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const status = getValue()

          return <ProductStatusCell status={status} />
        },
      }),
      listColumnHelper.display({
        id: "actions",
        cell: ({ row }) => {
          return (
            <ProductListCellActions
              productId={row.original.id}
              salesChannelId={id}
            />
          )
        },
      }),
    ],
    [t]
  )
}

const ProductListCellActions = ({
  salesChannelId,
  productId,
}: {
  productId: string
  salesChannelId: string
}) => {
  const { t } = useTranslation()
  const { mutateAsync } = useAdminDeleteProductsFromSalesChannel(salesChannelId)

  const onRemove = async () => {
    await mutateAsync({
      product_ids: [{ id: productId }],
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <Link to={`/products/${productId}`}>
          <DropdownMenu.Item className="gap-x-2">
            <PencilSquare />
            <span>Edit</span>
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onRemove} className="gap-x-2">
          <Trash />
          <span>{t("general.remove")}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const AddProductsToSalesChannelSchema = zod.object({
  product_ids: zod.array(zod.string()).min(1),
})

const PRODUCT_PAGE_SIZE = 50

type AddProductsModalProps = {
  salesChannelId: string
}

const AddProductsModal = ({ salesChannelId }: AddProductsModalProps) => {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PRODUCT_PAGE_SIZE,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const { products, count, isLoading } = useAdminProducts({
    expand: "variants,sales_channels",
    q: query,
  })

  const columns = useAddProductsColumns(salesChannelId)

  const table = useReactTable({
    data: (products ?? []) as Product[],
    columns,
    pageCount: Math.ceil((count ?? 0) / PRODUCT_PAGE_SIZE),
    state: {
      pagination,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    getRowId: (row) => row.id,
    enableRowSelection(row) {
      return !row.original.sales_channels
        ?.map((sc) => sc.id)
        .includes(salesChannelId)
    },
    meta: {
      salesChannelId,
    },
  })

  const { t } = useTranslation()

  const { mutateAsync } = useAdminAddProductsToSalesChannel(salesChannelId)

  const onOpenChange = (value: boolean) => {
    if (!value) {
      setRowSelection({})
      setPagination({
        pageIndex: 0,
        pageSize: PRODUCT_PAGE_SIZE,
      })
    }

    setOpen(value)
  }

  const onSubmit = async () => {
    const ids = Object.keys(rowSelection)

    try {
      AddProductsToSalesChannelSchema.parse({ product_ids: ids })
    } catch (error) {
      // TODO: Ask Ludvig where we should display errors in FocusModal forms
      console.error(error)
      return
    }

    await mutateAsync(
      {
        product_ids: ids.map((id) => ({ id })),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(adminProductKeys.lists())
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <FocusModal open={open} onOpenChange={onOpenChange}>
      <FocusModal.Trigger asChild>
        <Button variant="secondary">{t("salesChannels.addProducts")}</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("general.cancel")}
            </Button>
            <Button onClick={onSubmit}>{t("general.save")}</Button>
          </div>
        </FocusModal.Header>
        <FocusModal.Body className="flex h-full w-full flex-col items-center overflow-y-auto">
          <div className="flex w-full items-center justify-between px-8 pb-4 pt-6">
            <Heading>{t("salesChannels.addProducts")}</Heading>
            <div>
              <DebouncedSearch size="small" value={query} onChange={setQuery} />
            </div>
          </div>
          <div className="w-full flex-1 overflow-y-auto">
            <Table>
              <Table.Header>
                {table.getHeaderGroups().map((headerGroup) => {
                  return (
                    <Table.Row
                      key={headerGroup.id}
                      className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
                      "transition-fg",
                      {
                        "bg-ui-bg-highlight hover:bg-ui-bg-highlight-hover":
                          row.getIsSelected(),
                      },
                      {
                        "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                          row.original.sales_channels
                            ?.map((sc) => sc.id)
                            .includes(salesChannelId),
                      }
                    )}
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
          </div>
          <div className="w-full border-t">
            <Table.Pagination
              canNextPage={table.getCanNextPage()}
              canPreviousPage={table.getCanPreviousPage()}
              nextPage={table.nextPage}
              previousPage={table.previousPage}
              count={count ?? 0}
              pageIndex={pageIndex}
              pageCount={table.getPageCount()}
              pageSize={PRODUCT_PAGE_SIZE}
            />
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  )
}

const addProductsColumnHelper = createColumnHelper<Product>()

const useAddProductsColumns = (salesChannelId: string) => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      addProductsColumnHelper.display({
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
          const isAdded = row.original.sales_channels
            ?.map((sc) => sc.id)
            .includes(salesChannelId)

          const isSelected = row.getIsSelected() || isAdded

          const Component = (
            <Checkbox
              checked={isSelected}
              disabled={isAdded}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )

          if (isAdded) {
            return (
              <Tooltip
                content={t("salesChannels.productAlreadyAdded")}
                side="right"
              >
                {Component}
              </Tooltip>
            )
          }

          return Component
        },
      }),
      addProductsColumnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ row }) => {
          const product = row.original

          return <ProductTitleCell product={product} />
        },
      }),
      addProductsColumnHelper.accessor("collection", {
        header: t("fields.collection"),
        cell: ({ getValue }) => {
          const collection = getValue()

          return <ProductCollectionCell collection={collection} />
        },
      }),
      addProductsColumnHelper.accessor("sales_channels", {
        header: t("fields.availability"),
        cell: ({ getValue }) => {
          const salesChannels = getValue()

          return <ProductAvailabilityCell salesChannels={salesChannels} />
        },
      }),
      addProductsColumnHelper.accessor("variants", {
        header: t("fields.inventory"),
        cell: (cell) => {
          const variants = cell.getValue()

          return <ProductInventoryCell variants={variants} />
        },
      }),
      addProductsColumnHelper.accessor("status", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const status = getValue()

          return <ProductStatusCell status={status} />
        },
      }),
    ],
    [t]
  )
}
