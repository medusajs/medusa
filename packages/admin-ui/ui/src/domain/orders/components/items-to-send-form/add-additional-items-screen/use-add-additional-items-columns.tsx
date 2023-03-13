import { Order } from "@medusajs/medusa"
import { PricedVariant } from "@medusajs/medusa/dist/types/pricing"
import { createColumnHelper } from "@tanstack/react-table"
import clsx from "clsx"
import { useMemo } from "react"
import Thumbnail from "../../../../../components/atoms/thumbnail"
import Tooltip from "../../../../../components/atoms/tooltip"
import SortingIcon from "../../../../../components/fundamentals/icons/sorting-icon"
import IndeterminateCheckbox from "../../../../../components/molecules/indeterminate-checkbox"
import { formatAmountWithSymbol } from "../../../../../utils/prices"

const columnHelper = createColumnHelper<PricedVariant>()

export const useAddAdditionalItemsColumns = (order: Order) => {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "selection",
        maxSize: 36,
        header: ({ table }) => {
          return (
            <div className="pl-base pr-large">
              <IndeterminateCheckbox
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                indeterminate={table.getIsSomePageRowsSelected()}
              />
            </div>
          )
        },
        cell: ({
          row: {
            getIsSelected,
            getIsSomeSelected,
            getToggleSelectedHandler,
            getCanSelect,
          },
        }) => {
          const canSelect = getCanSelect()

          return (
            <div className="pl-base pr-large">
              {canSelect ? (
                <IndeterminateCheckbox
                  checked={getIsSelected()}
                  indeterminate={getIsSomeSelected()}
                  onChange={getToggleSelectedHandler()}
                  disabled={!canSelect}
                />
              ) : (
                <Tooltip
                  content={
                    "This variant does not have a price for the region/currency of this order, and cannot be selected."
                  }
                >
                  <IndeterminateCheckbox
                    checked={getIsSelected()}
                    indeterminate={getIsSomeSelected()}
                    onChange={getToggleSelectedHandler()}
                    disabled={!canSelect}
                  />
                </Tooltip>
              )}
            </div>
          )
        },
      }),
      columnHelper.accessor("title", {
        header: ({
          header: {
            column: { getToggleSortingHandler, getIsSorted },
          },
        }) => (
          <div
            className="flex cursor-pointer items-center"
            onClick={getToggleSortingHandler()}
          >
            <p className="select-none">Title</p>
            <div
              className="h-large w-large flex items-center justify-center"
              onClick={getToggleSortingHandler()}
            >
              <SortingIcon size={16} isSorted={getIsSorted()} />
            </div>
          </div>
        ),
        cell: ({
          cell: { getValue },
          row: {
            original: { product, sku },
            getCanSelect,
          },
        }) => {
          const isSelectable = getCanSelect()

          return (
            <div
              className={clsx(
                "inter-small-regular gap-base py-xsmall flex items-center",
                {
                  "opacity-50": !isSelectable,
                }
              )}
            >
              <Thumbnail src={product?.thumbnail} />
              <div>
                <p>
                  {product?.title}{" "}
                  <span className="text-grey-50">({getValue()})</span>
                </p>
                {sku && <p className="text-grey-50">{sku}</p>}
              </div>
            </div>
          )
        },
      }),
      columnHelper.display({
        maxSize: 80,
        id: "options",
        header: () => <p className="select-none">Options</p>,
        cell: ({ row: { original } }) => {
          return <p>{original.options?.map((o) => o.value).join(", ")}</p>
        },
      }),
      columnHelper.accessor("inventory_quantity", {
        maxSize: 20,
        header: () => <p className="select-none text-right">Stock</p>,
        cell: ({ cell: { getValue }, row: { getCanSelect } }) => {
          const isSelectable = getCanSelect()

          return (
            <p
              className={clsx("text-right", {
                "opacity-50": !isSelectable,
              })}
            >
              {getValue()}
            </p>
          )
        },
      }),
      columnHelper.accessor("calculated_price_incl_tax", {
        maxSize: 80,
        header: () => <p className="text-right">Price</p>,
        cell: ({
          getValue,
          row: {
            original: { original_price_incl_tax },
          },
        }) => {
          const price = getValue()

          return (
            <div className="text-right">
              {original_price_incl_tax !== price && (
                <Tooltip
                  content="The price has been overridden in a price list, that is applicable to this order."
                  side="top"
                >
                  <p className="text-grey-40 cursor-default line-through">
                    {formatAmountWithSymbol({
                      amount: original_price_incl_tax || 0,
                      currency: order.currency_code,
                    })}
                  </p>
                </Tooltip>
              )}
              <p>
                {formatAmountWithSymbol({
                  amount: price || 0,
                  currency: order.currency_code,
                })}
              </p>
            </div>
          )
        },
      }),
      columnHelper.display({
        id: "order_currency",
        maxSize: 24,
        cell: () => {
          return (
            <p className="pl-base text-grey-50">
              {order.currency_code.toUpperCase()}
            </p>
          )
        },
      }),
    ],
    [order]
  )

  return columns
}
