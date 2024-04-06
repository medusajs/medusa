import { Checkbox } from "@medusajs/ui"
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
import { useDataTable } from "../../../../../hooks/use-data-table"
import { ExtendedProductDTO } from "../../../../../types/api-responses"
import { PricingCreateSchemaType, PricingProductsRecordType } from "./schema"

type PricingProductsFormProps = {
  form: UseFormReturn<PricingCreateSchemaType>
}

const PAGE_SIZE = 50

function getInitialSelection(ids: string[]) {
  return ids.reduce((acc, key) => {
    acc[key] = true
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

  const { products, count, isLoading, isError, error } = useProducts()

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

    setValue("product_ids", ids, { shouldDirty: true, shouldTouch: true })

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
    pageSize: 50,
  })

  if (isError) {
    throw error
  }

  return (
    <div className="flex size-full flex-col">
      <DataTable
        table={table}
        columns={columns}
        pageSize={PAGE_SIZE}
        count={count}
        isLoading={isLoading}
        layout="fill"
        orderBy={["title", "status", "created_at", "updated_at"]}
        pagination
        search
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
