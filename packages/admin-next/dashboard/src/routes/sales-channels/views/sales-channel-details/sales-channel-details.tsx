import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
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
import {
  useAdminDeleteProductsFromSalesChannel,
  useAdminProducts,
  useAdminSalesChannel,
} from "medusa-react"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link, useParams } from "react-router-dom"
import { JsonView } from "../../../../components/common/json-view"
import { Thumbnail } from "../../../../components/common/thumbnail"

export const SalesChannelDetails = () => {
  const { id } = useParams()

  const { sales_channel, isLoading } = useAdminSalesChannel(id!)

  const { t } = useTranslation()

  if (isLoading || !sales_channel) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col gap-y-2">
      <Container className="p-0">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <Heading>{sales_channel.name}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {sales_channel.description}
            </Text>
          </div>
          <div className="flex items-center gap-x-2">
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton variant="transparent">
                  <EllipsisHorizontal />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item className="gap-x-2">
                  <PencilSquare className="text-ui-fg-subtle" />
                  <span>{t("general.edit")}</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="gap-x-2">
                  <Trash className="text-ui-fg-subtle" />
                  <span>{t("general.delete")}</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
      </Container>
      <SalesChannelProducts id={id!} />
      <JsonView data={sales_channel} />
    </div>
  )
}

const PAGE_SIZE = 20

const SalesChannelProducts = ({ id }: { id: string }) => {
  const { t } = useTranslation()

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

  const { products, count, isLoading } = useAdminProducts({
    sales_channel_id: [id],
    limit: PAGE_SIZE,
    offset: pageIndex * PAGE_SIZE,
  })

  const columns = useColumns({ id })

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
    <Container className="p-0">
      <div className="px-8 pb-4 pt-6">
        <Heading level="h2">{t("products.domain")}</Heading>
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
              action={() => {
                console.log("Delete")
              }}
              shortcut="d"
              label={t("general.delete")}
            />
          </CommandBar.Bar>
        </CommandBar>
      </div>
    </Container>
  )
}

const ProductActions = ({
  salesChannelId,
  productId,
}: {
  productId: string
  salesChannelId: string
}) => {
  const { t } = useTranslation()
  const { mutateAsync } = useAdminDeleteProductsFromSalesChannel(salesChannelId)

  const handleDelete = async () => {
    await mutateAsync({
      product_ids: [{ id: productId }],
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger>
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
        <DropdownMenu.Item onClick={handleDelete} className="gap-x-2">
          <Trash />
          <span>{t("general.remove")}</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<Product>()

const useColumns = ({ id }: { id: string }) => {
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
          return (
            <ProductActions productId={row.original.id} salesChannelId={id} />
          )
        },
      }),
    ],
    [t]
  )
}
