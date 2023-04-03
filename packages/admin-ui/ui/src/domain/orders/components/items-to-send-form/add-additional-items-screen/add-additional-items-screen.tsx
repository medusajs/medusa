import { Order } from "@medusajs/medusa"
import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import { useAdminVariants } from "medusa-react"
import { useMemo, useState } from "react"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../../components/molecules/modal/layered-modal"
import TablePagination from "../../../../../components/molecules/table-pagination"
import { useDebounce } from "../../../../../hooks/use-debounce"
import { AdditionalItem } from "../index"
import { AddAdditionalItemsTable } from "./add-additional-items-table"
import { useAddAdditionalItemsColumns } from "./use-add-additional-items-columns"

type Props = {
  append: (items: AdditionalItem[]) => void
  remove: (index: number | number[] | undefined) => void
  selectedIds: string[]
  order: Order
}

const PAGE_SIZE = 12

const AddAdditionalItemsScreen = ({
  append,
  remove,
  selectedIds,
  order,
}: Props) => {
  const { pop } = useLayeredModal()

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  })
  const [sorting, setSorting] = useState<SortingState>([])

  const offset = useMemo(() => pageIndex * pageSize, [pageIndex, pageSize])
  const [query, setQuery] = useState<string | undefined>(undefined)

  const debouncedQuery = useDebounce(query, 500)

  const { variants, count, isLoading } = useAdminVariants(
    {
      limit: PAGE_SIZE,
      offset,
      q: debouncedQuery,
      region_id: order.region_id,
      customer_id: order.customer_id,
    },
    {
      keepPreviousData: true,
    }
  )

  const numPages = useMemo(
    () => (count ? Math.ceil(count / PAGE_SIZE) : 0),
    [count]
  )

  const pagination = useMemo(() => {
    return {
      pageIndex,
      pageSize,
    }
  }, [pageIndex, pageSize])

  const columns = useAddAdditionalItemsColumns(order)

  const isRowSelectable = (row: Row<PricedVariant>) => {
    const { currency_code, region_id } = order

    const hasRegionPrice = row.original.prices.some(
      (p) => p.region_id === region_id
    )
    const hasCurrencyPrice = row.original.prices.some(
      (p) => p.currency_code === currency_code
    )

    if (!(hasRegionPrice || hasCurrencyPrice)) {
      return false
    }

    return true
  }

  const table = useReactTable<PricedVariant>({
    columns,
    data: variants || [],
    initialState: {
      rowSelection: selectedIds.reduce((acc, id) => {
        acc[id] = true
        return acc
      }, {}),
    },
    state: {
      pagination,
      sorting,
    },
    enableRowSelection: isRowSelectable,
    onPaginationChange: setPagination,
    manualPagination: true,
    getRowId: (row) => row.id!,
    pageCount: numPages,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const { getSelectedRowModel } = table

  const onSubmit = () => {
    const selectedVariants = getSelectedRowModel().rows.map(
      (row) => row.original
    )

    const itemsToRemove: number[] = []

    for (const id of selectedIds) {
      const index = selectedVariants.findIndex((v) => v.id === id)
      if (index !== -1) {
        itemsToRemove.push(index)
      }
    }

    remove(itemsToRemove)

    const toAppend: AdditionalItem[] = selectedVariants.map((variant) => ({
      variant_id: variant.id!,
      quantity: 1,
      sku: variant.sku,
      product_title: variant.product!.title,
      variant_title: variant.title!,
      thumbnail: variant.product!.thumbnail,
      in_stock: variant.inventory_quantity!,
      price: variant.calculated_price_incl_tax!,
      original_price: variant.original_price_incl_tax!,
    }))

    append(toAppend)
    pop()
  }

  return (
    <>
      <Modal.Content>
        <AddAdditionalItemsTable
          instance={table}
          isLoadingData={isLoading}
          setSearchTerm={setQuery}
        />
        <TablePagination table={table} count={count} className="mt-11" />
      </Modal.Content>
      <Modal.Footer>
        <div className="gap-x-xsmall flex w-full items-center justify-end">
          <Button variant="secondary" size="small" onClick={pop}>
            Go back
          </Button>
          <Button
            variant="primary"
            size="small"
            type="button"
            onClick={onSubmit}
          >
            Add products
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddAdditionalItemsScreen = () => {
  const { push, pop } = useLayeredModal()

  const pushScreen = (props: Props) => {
    push({
      title: "Add Product Variants",
      onBack: () => pop(),
      view: <AddAdditionalItemsScreen {...props} />,
    })
  }

  return { pushScreen }
}
