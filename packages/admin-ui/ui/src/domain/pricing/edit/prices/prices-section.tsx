import {
  CurrencyDollar,
  EllipsisHorizontal,
  ExclamationCircle,
  PencilSquare,
  PhotoSolid,
  Spinner,
  Tag,
  Trash,
} from "@medusajs/icons"
import type { PriceList, Product } from "@medusajs/medusa"
import {
  Checkbox,
  CommandBar,
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
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
  getPaginationRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table"
import {
  useAdminDeletePriceListProductPrices,
  useAdminDeletePriceListProductsPrices,
  useAdminPriceListProducts,
} from "medusa-react"
import * as React from "react"

import { useTranslation } from "react-i18next"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDebouncedSearchParam } from "../../../../hooks/use-debounced-search-param"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import {
  getDateComparisonOperatorFromSearchParams,
  getStringFromSearchParams,
} from "../../../../utils/search-param-utils"
import { ProductFilter, ProductFilterMenu } from "../../components"
import { AddProductsModal } from "./add-products-modal"
import { EditPricesModal } from "./edit-prices-modal"
import i18n from "../../../../i18n"

type PriceListPricesSectionProps = {
  priceList: PriceList
}

const PAGE_SIZE = 10
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48

const PriceListPricesSection = ({ priceList }: PriceListPricesSectionProps) => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const { t } = useTranslation()

  const [showAddProductsModal, setShowAddProductsModal] = React.useState(false)
  const [showEditPricesModal, setShowEditPricesModal] = React.useState(false)

  const [productIdsToEdit, setProductIdsToEdit] = React.useState<
    string[] | null
  >(null)

  /**
   * Table state.
   */
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })

  /**
   * Calculate the offset based on the pagination state.
   */
  const offset = React.useMemo(
    () => pagination.pageIndex * pagination.pageSize,
    [pagination.pageIndex, pagination.pageSize]
  )

  const { query, setQuery } = useDebouncedSearchParam()

  const onFiltersChange = (filters: ProductFilter) => {
    const current = new URLSearchParams(searchParams)

    if (filters.created_at) {
      current.set("created_at", JSON.stringify(filters.created_at))
    } else {
      current.delete("created_at")
    }

    if (filters.updated_at) {
      current.set("updated_at", JSON.stringify(filters.updated_at))
    } else {
      current.delete("updated_at")
    }

    navigate({ search: current.toString() }, { replace: true })
  }

  const onClearFilters = () => {
    const current = new URLSearchParams(searchParams)

    current.delete("created_at")
    current.delete("updated_at")

    navigate({ search: current.toString() }, { replace: true })
  }

  const prompt = usePrompt()
  const notification = useNotification()

  const { mutateAsync, isLoading: isDeletingProductPrices } =
    useAdminDeletePriceListProductsPrices(priceList.id)

  const handleDeleteProductPrices = async () => {
    const res = await prompt({
      title: t("price-list-prices-section-prompt-title", "Are you sure?"),
      description: t(
        "price-list-prices-section-prompt-description",
        "This will permanently delete the product prices from the list"
      ),
    })

    if (!res) {
      return
    }

    await mutateAsync(
      {
        product_ids: Object.keys(rowSelection),
      },
      {
        onSuccess: () => {
          notification(
            t(
              "price-list-prices-secton-delete-success-title",
              "Prices deleted"
            ),
            t(
              "price-list-prices-section-delete-success-description",
              `Successfully deleted prices for {{count}} products`,
              {
                count: Object.keys(rowSelection).length,
              }
            ),
            "success"
          )
          setRowSelection({})
        },
        onError: (err) => {
          notification(
            t(
              "price-list-prices-section-delete-error-title",
              "An error occurred"
            ),
            getErrorMessage(err),
            "error"
          )
        },
      }
    )
  }

  const { products, count, isLoading, isError } = useAdminPriceListProducts(
    priceList.id,
    {
      limit: PAGE_SIZE,
      offset,
      expand: "variants,collection",
      created_at: getDateComparisonOperatorFromSearchParams(
        "created_at",
        searchParams
      ),
      updated_at: getDateComparisonOperatorFromSearchParams(
        "updated_at",
        searchParams
      ),
      q: getStringFromSearchParams("q", searchParams),
    },
    {
      keepPreviousData: true,
    }
  )

  const { products: allProducts } = useAdminPriceListProducts(
    priceList.id,
    {
      limit: count,
      fields: "id",
    },
    {
      enabled: !!count,
    }
  )

  const onEditPricesModalOpenChange = React.useCallback((open: boolean) => {
    switch (open) {
      case true:
        setShowEditPricesModal(true)
        break
      case false:
        setShowEditPricesModal(false)
        setProductIdsToEdit(null)
        setRowSelection({})
        break
    }
  }, [])

  const onEditAllProductPrices = React.useCallback(() => {
    setProductIdsToEdit(allProducts?.map((p) => p.id) as string[])
    setShowEditPricesModal(true)
  }, [allProducts])

  const onEditSelectedProductPrices = React.useCallback(() => {
    setProductIdsToEdit(Object.keys(rowSelection))
    setShowEditPricesModal(true)
  }, [rowSelection])

  const onEditSingleProductPrices = (id: string) => {
    setProductIdsToEdit([id])
    setShowEditPricesModal(true)
  }

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = usePriceListProudctColumns({
    onEditProductPrices: onEditSingleProductPrices,
  })

  const table = useReactTable({
    columns,
    data: (products as Product[] | undefined) ?? [],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row) => row.id,
    state: {
      rowSelection,
      pagination,
    },
    meta: {
      priceListId: priceList.id,
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })
  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-8 pb-4 pt-6">
        <Heading>{t("price-list-prices-section-heading", "Prices")}</Heading>
        <div className="flex items-center gap-x-2">
          <ProductFilterMenu
            value={{
              created_at: getDateComparisonOperatorFromSearchParams(
                "created_at",
                searchParams
              ),
              updated_at: getDateComparisonOperatorFromSearchParams(
                "updated_at",
                searchParams
              ),
            }}
            onFilterChange={onFiltersChange}
            onClearFilters={onClearFilters}
          />
          <Input
            type="search"
            size="small"
            placeholder={
              t(
                "price-list-prices-section-search-placeholder",
                "Search products"
              ) ?? undefined
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <DropdownMenu dir={i18n.dir()}>
            <DropdownMenu.Trigger asChild>
              <IconButton>
                <EllipsisHorizontal />
              </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" side="bottom">
              <DropdownMenu.Item onClick={onEditAllProductPrices}>
                <CurrencyDollar className="text-ui-fg-subtle" />
                <span className="ms-2">
                  {t(
                    "price-list-prices-section-prices-menu-edit",
                    "Edit prices"
                  )}
                </span>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setShowAddProductsModal(true)}>
                <Tag className="text-ui-fg-subtle" />
                <span className="ms-2">
                  {t(
                    "price-list-prices-section-prices-menu-add",
                    "Add products"
                  )}
                </span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>
      <div
        className="border-ui-border-base relative h-full flex-1 border-b"
        style={{
          height: TABLE_HEIGHT,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner className="text-ui-fg-subtle animate-spin" />
          </div>
        )}
        {isError && (
          <div className="text-ui-fg-subtle absolute inset-0 flex items-center justify-center gap-x-2">
            <ExclamationCircle />
            <Text size="small">
              {t(
                "price-list-prices-section-table-load-error",
                "An error occured while fetching the products. Try to reload the page, or if the issue persists, try again later."
              )}
            </Text>
          </div>
        )}
        <Table>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap [&_th]:w-1/3"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <Table.HeaderCell
                        key={header.id}
                        className="text-start pe-6"
                      >
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
                  <Table.Cell key={cell.id} className="text-start pe-6">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <Table.Pagination
        count={count ?? 0}
        canNextPage={table.getCanNextPage()}
        canPreviousPage={table.getCanPreviousPage()}
        nextPage={table.nextPage}
        previousPage={table.previousPage}
        pageIndex={pagination.pageIndex}
        pageCount={pageCount}
        pageSize={pagination.pageSize}
      />
      <AddProductsModal
        productIds={(allProducts?.map((p) => p.id) as string[]) ?? []}
        priceList={priceList}
        open={showAddProductsModal}
        onOpenChange={setShowAddProductsModal}
      />
      {productIdsToEdit && (
        <EditPricesModal
          open={showEditPricesModal}
          onOpenChange={onEditPricesModalOpenChange}
          productIds={productIdsToEdit}
          priceList={priceList}
        />
      )}
      <CommandBar open={Object.keys(rowSelection).length > 0}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {t("price-list-prices-section-bar-count", "{{count}} selected", {
              count: Object.keys(rowSelection).length,
            })}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            shortcut="e"
            label={t("price-list-prices-section-edit-command", "Edit")}
            action={onEditSelectedProductPrices}
            disabled={
              isDeletingProductPrices ||
              showAddProductsModal ||
              showEditPricesModal
            }
          />
          <CommandBar.Seperator />
          <CommandBar.Command
            shortcut="d"
            label={t("price-list-prices-section-delete-command", "Delete")}
            action={handleDeleteProductPrices}
            disabled={
              isDeletingProductPrices ||
              showAddProductsModal ||
              showEditPricesModal
            }
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}

const columnHelper = createColumnHelper<Product>()

type UsePriceListProudctColumnsProps = {
  onEditProductPrices: (id: string) => void
}

const usePriceListProudctColumns = ({
  onEditProductPrices,
}: UsePriceListProudctColumnsProps) => {
  const { t } = useTranslation()

  const columns = React.useMemo(
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
              aria-label={
                t(
                  "price-list-prices-section-select-all-checkbox-label",
                  "Select all products on the current page"
                ) ?? undefined
              }
            />
          )
        },
        cell: ({ row }) => {
          return (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={
                t(
                  "price-list-prices-section-select-checkbox-label",
                  "Select row"
                ) ?? undefined
              }
            />
          )
        },
      }),
      columnHelper.accessor("title", {
        header: () => t("price-list-prices-section-table-product", "Product"),
        cell: (info) => {
          const title = info.getValue()
          const thumbnail = info.row.original.thumbnail

          return (
            <div className="flex items-center gap-x-3">
              <div className="bg-ui-bg-subtle flex h-8 w-6 items-center justify-center overflow-hidden rounded-[4px]">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={
                      t(
                        "price-list-prices-section-table-thumbnail-alt",
                        "{{title}} thumbnail",
                        {
                          title,
                        }
                      ) ?? undefined
                    }
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PhotoSolid />
                )}
              </div>
              <Text size="small" className="text-ui-fg-base">
                {title}
              </Text>
            </div>
          )
        },
      }),
      columnHelper.accessor("collection", {
        header: () =>
          t("price-list-prices-section-table-collection", "Collection"),
        cell: (info) => info.getValue()?.title ?? "-",
      }),
      columnHelper.accessor("variants", {
        header: () => t("price-list-prices-section-table-variants", "Variants"),
        cell: (info) => {
          const variants = info.getValue()
          return variants?.length ?? "-"
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: ({ table, row }) => {
          const { priceListId } = table.options.meta as {
            priceListId: string | undefined
          }

          return (
            <PriceListProductRowActions
              row={row}
              priceListId={priceListId}
              onEditProductPrices={onEditProductPrices}
            />
          )
        },
      }),
    ],
    [t, onEditProductPrices]
  )

  return { columns }
}

type PriceListProductRowActionsProps = {
  row: Row<Product>
  priceListId?: string
  onEditProductPrices: (id: string) => void
}

const PriceListProductRowActions = ({
  row,
  priceListId,
  onEditProductPrices,
}: PriceListProductRowActionsProps) => {
  const { mutateAsync } = useAdminDeletePriceListProductPrices(
    priceListId!,
    row.original.id
  )

  const prompt = usePrompt()
  const notification = useNotification()

  const onDelete = async () => {
    const response = await prompt({
      title: "Are you sure?",
      description:
        "This will permanently delete the product prices from the list",
    })

    if (!response) {
      return
    }

    return mutateAsync(undefined, {
      onSuccess: ({ deleted }) => {
        if (deleted) {
          notification(
            "Prices deleted",
            `Successfully deleted prices for ${row.original.title}`,
            "success"
          )
        }

        if (!deleted) {
          notification(
            "Failed to delete prices",
            `No prices were deleted for ${row.original.title}`,
            "error"
          )
        }
      },
      onError: (err) => {
        notification("An error occurred", getErrorMessage(err), "error")
      },
    })
  }

  const onEdit = () => {
    onEditProductPrices(row.original.id)
  }

  return (
    <DropdownMenu dir={i18n.dir()}>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="transparent">
          <EllipsisHorizontal />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" side="bottom">
        <DropdownMenu.Item onClick={onEdit}>
          <PencilSquare className="text-ui-fg-subtle" />
          <span className="ms-2">Edit prices</span>
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onClick={onDelete}>
          <Trash className="text-ui-fg-subtle" />
          <span className="ms-2">Delete prices</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

export { PriceListPricesSection }
