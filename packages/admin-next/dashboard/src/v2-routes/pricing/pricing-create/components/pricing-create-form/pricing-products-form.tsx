import { Checkbox } from "@medusajs/ui"
import { keepPreviousData } from "@tanstack/react-query"
import {
  OnChangeFn,
  RowSelectionState,
  createColumnHelper,
} from "@tanstack/react-table"
import { useMemo, useState } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import { DataTable } from "../../../../../components/table/data-table"
import { useProducts } from "../../../../../hooks/api/products"
import { useProductTableColumns } from "../../../../../hooks/table/columns/use-product-table-columns"
import { useProductTableFilters } from "../../../../../hooks/table/filters/use-product-table-filters"
import { useProductTableQuery } from "../../../../../hooks/table/query/use-product-table-query"
import { useDataTable } from "../../../../../hooks/use-data-table"
import { ExtendedProductDTO } from "../../../../../types/api-responses"
import { PricingProductsRecordType } from "../../../common/schemas"
import { PricingCreateSchemaType } from "./schema"

type PricingProductsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

const PAGE_SIZE = 50
const PREFIX = "p"

function getInitialSelection(products: { id: string }[]) {
  return products.reduce((acc, curr) => {
    acc[curr.id] = true
    return acc
  }, {} as RowSelectionState)
}

export const PricingProductsForm = ({ form }: PricingProductsFormProps) => {
  const { control, setValue } = form

  const selectedIds = useWatch({
    control,
    name: "product_ids",
  })

  const productRecords = useWatch({
    control,
    name: "products",
  })

  const [rowSelection, setRowSelection] = useState<RowSelectionState>(
    getInitialSelection(selectedIds)
  )

  const { searchParams, raw } = useProductTableQuery({
    pageSize: PAGE_SIZE,
    prefix: PREFIX,
  })
  const { products, count, isLoading, isError, error } = useProducts(
    searchParams,
    {
      placeholderData: keepPreviousData,
    }
  )

  const updater: OnChangeFn<RowSelectionState> = (fn) => {
    const state = typeof fn === "function" ? fn(rowSelection) : fn

    const ids = Object.keys(state)
    const productRecordKeys = Object.keys(productRecords)

    const updatedRecords = productRecordKeys.reduce((acc, key) => {
      if (ids.includes(key)) {
        acc[key] = productRecords[key]
      }

      return acc
    }, {} as PricingProductsRecordType)

    const update = ids.map((id) => ({ id }))

    setValue("product_ids", update, { shouldDirty: true, shouldTouch: true })

    /**
     * Update the product records to ensure that all unselected products
     * are removed from the form state.
     */
    setValue("products", updatedRecords, {
      shouldDirty: true,
      shouldTouch: true,
    })

    setRowSelection(state)
  }

  const columns = useColumns()
  const filters = useProductTableFilters()

  const { table } = useDataTable({
    data: products || [],
    columns,
    count,
    enablePagination: true,
    enableRowSelection: (row) => {
      return row.original.variants.length > 0
    },
    getRowId: (row) => row.id,
    rowSelection: {
      state: rowSelection,
      updater,
    },
    pageSize: PAGE_SIZE,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col">
      <DataTable
        table={table}
        columns={columns}
        filters={filters}
        pageSize={PAGE_SIZE}
        prefix={PREFIX}
        count={count}
        isLoading={isLoading}
        layout="fill"
        orderBy={["title", "status", "created_at", "updated_at"]}
        pagination
        search
        queryObject={raw}
      />
    </div>
  )
}

const columnHelper = createColumnHelper<ExtendedProductDTO>()

const useColumns = () => {
  const base = useProductTableColumns()

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
              disabled={!row.getCanSelect()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              onClick={(e) => {
                e.stopPropagation()
              }}
            />
          )
        },
      }),
      ...base,
    ],
    [base]
  )
}
