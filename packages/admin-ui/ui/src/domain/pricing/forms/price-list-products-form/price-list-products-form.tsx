import { ExclamationCircle, PhotoSolid, Spinner } from "@medusajs/icons"
import type { Product } from "@medusajs/medusa"
import {
  Checkbox,
  Heading,
  Input,
  StatusBadge,
  Table,
  Text,
  clx,
} from "@medusajs/ui"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { useAdminProducts } from "medusa-react"
import * as React from "react"

import { useTranslation } from "react-i18next"
import { Form } from "../../../../components/helpers/form"
import { useDebounce } from "../../../../hooks/use-debounce"
import { NestedForm } from "../../../../utils/nested-form"
import { ProductFilter, ProductFilterMenu } from "../../components"
import { PriceListProductsSchema } from "./types"

interface PriceListProductsFormProps {
  form: NestedForm<PriceListProductsSchema>
  /**
   * Products that are already part of the price list.
   */
  productIds?: string[]
}

const PAGE_SIZE = 20

const columnHelper = createColumnHelper<Product>()

const usePriceListProductsFormColumns = () => {
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
                  "price-list-products-form-select-all",
                  "Select all products on the current page"
                ) ?? undefined
              }
            />
          )
        },
        cell: ({ table, row }) => {
          const { productIds } = table.options.meta as {
            productIds: string[]
          }

          const isSelected = row.getIsSelected() || productIds.includes(row.id)

          return (
            <Checkbox
              checked={isSelected}
              disabled={productIds.includes(row.id)}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value)
              }}
              aria-label={
                t("price-list-products-form-select-row", "Select row") ??
                undefined
              }
            />
          )
        },
      }),
      columnHelper.accessor("title", {
        header: () => t("price-list-products-form-product-label", "Product"),
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
                        "price-list-products-form-product-thumbnail",
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
          t("price-list-products-form-collection-label", "Collection"),
        cell: (info) => info.getValue()?.title ?? "-",
      }),
      columnHelper.accessor("sales_channels", {
        header: () =>
          t("price-list-products-form-sales-channels-label", "Availability"),
        cell: (info) => {
          const salesChannels = info.getValue()

          if (!salesChannels || salesChannels.length === 0) {
            return "-"
          }

          const first = salesChannels[0].name

          const remaining = salesChannels.length - 1

          if (!remaining) {
            return <span>{first}</span>
          }

          return (
            <span>
              {t(
                "price-list-products-form-sales-channels-value",
                "{{first}} + {{remaining}} more",
                {
                  first,
                  remaining,
                }
              )}
            </span>
          )
        },
      }),
      columnHelper.accessor("status", {
        header: () => t("price-list-products-form-status-label", "Status"),
        cell: (info) => {
          const status = info.getValue()

          return (
            <StatusBadge
              color={status === "published" ? "green" : "grey"}
              className="capitalize"
            >
              {status}
            </StatusBadge>
          )
        },
      }),
      columnHelper.accessor("variants", {
        header: () => (
          <div className="text-end">
            {t("price-list-products-form-inventory-label", "Inventory")}
          </div>
        ),
        cell: (info) => {
          let content: string | undefined = "-"

          const variants = info.getValue()

          if (!variants || variants.length === 0) {
            content = "-"
          }

          const totalStock = variants.reduce((acc, curr) => {
            return acc + curr.inventory_quantity
          }, 0)

          content =
            t(
              "price-list-products-form-inventory-value",
              "{{totalStock}} in stock across {{variants}} variants",
              {
                totalStock,
                variants: variants.length,
              }
            ) ?? undefined

          return <div className="text-end">{content}</div>
        },
      }),
    ],
    [t]
  )

  return { columns }
}

const PriceListProductsForm = ({
  form,
  productIds,
}: PriceListProductsFormProps) => {
  const {
    register,
    path,
    setValue,
    getValues,
    control,
    formState: { isDirty },
  } = form

  const { t } = useTranslation()

  /**
   * Table state.
   */
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>(
    (getValues(path("ids")) ?? []).reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: true,
      }
    }, {} as RowSelectionState)
  )

  React.useEffect(() => {
    const values = getValues(path("ids")) ?? []

    setRowSelection(
      values.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: true,
        }
      }, {} as RowSelectionState)
    )
  }, [getValues, path])

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

  const [filters, setFilters] = React.useState<ProductFilter>({
    created_at: undefined,
    updated_at: undefined,
  })

  /**
   * Search query.
   */
  const [query, setQuery] = React.useState<string>("")
  const debouncedQuery = useDebounce(query, 500)

  const { products, count, isLoading, isError } = useAdminProducts(
    {
      limit: 20,
      offset,
      expand: "variants,sales_channels,collection",
      q: debouncedQuery,
      ...filters,
    },
    {
      keepPreviousData: true,
    }
  )

  const pageCount = React.useMemo(() => {
    return count ? Math.ceil(count / PAGE_SIZE) : 0
  }, [count])

  const { columns } = usePriceListProductsFormColumns()

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
      productIds: productIds ?? [],
    },
    pageCount,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    onPaginationChange: setPagination,
  })

  /**
   * Register the form field.
   */
  React.useEffect(() => {
    register(path("ids"))
  }, [register, path])

  /**
   * Update the form value when the row selection changes.
   *
   * The RowSelectionState will only contain the rows that are
   * selected, so we need to get the keys and set the value to
   * the array of keys.
   */
  React.useEffect(() => {
    setValue(path("ids"), Object.keys(rowSelection), {
      shouldDirty: true,
      shouldTouch: true,
    })
  }, [rowSelection, path, setValue])

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="animate-spin" />
        <span className="sr-only">
          {t("price-list-products-form-loading", "Loading products")}
        </span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">
          {t(
            "price-list-products-form-error",
            "An error occurred while loading products. Reload the page and try again. If the issue persists, try again later."
          )}
        </Text>
      </div>
    )
  }

  if (!products) {
    return (
      <div className="flex h-full w-full items-center justify-center gap-x-2">
        <ExclamationCircle />
        <Text className="text-ui-fg-subtle">
          {t("price-list-products-form-no-products", "No products found.")}
        </Text>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-ui-border-base flex items-center justify-between border-b px-8 pb-4 pt-6">
        <div className="flex items-center gap-x-3">
          <Heading>
            {t("price-list-products-form-heading", "Choose products")}
          </Heading>

          <Form.Field
            control={control}
            name={path("ids")}
            render={() => {
              return (
                <Form.Item>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </div>
        <div className={clx("flex items-center gap-x-2")}>
          <ProductFilterMenu
            onClearFilters={() =>
              setFilters({
                created_at: undefined,
                updated_at: undefined,
              })
            }
            onFilterChange={setFilters}
            value={filters}
          />
          <Input
            type="search"
            placeholder={
              t("price-list-products-form-search-placeholder", "Search") ??
              undefined
            }
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="border-ui-border-base relative h-full flex-1 overflow-y-auto border-b">
        <Table>
          <Table.Header className="border-t-0">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <Table.Row
                  key={headerGroup.id}
                  className="[&_th:first-of-type]:w-[1%] [&_th:first-of-type]:whitespace-nowrap"
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
                  {
                    "bg-ui-bg-disabled hover:bg-ui-bg-disabled":
                      productIds?.includes(row.id),
                  },
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
    </div>
  )
}

export { PriceListProductsForm }
