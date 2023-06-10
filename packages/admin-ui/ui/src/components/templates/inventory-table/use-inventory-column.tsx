import * as RadixPopover from "@radix-ui/react-popover"

import { Navigate, useNavigate } from "react-router-dom"

import Button from "../../fundamentals/button"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import { InventoryLevelDTO } from "@medusajs/types"
import Tooltip from "../../atoms/tooltip"
import { useMemo } from "react"

const useInventoryTableColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Item",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                {original.variants[0]?.product?.thumbnail ? (
                  <img
                    src={original.variants[0].product.thumbnail}
                    className="rounded-soft h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.variants[0]?.product?.title || ""}
            </div>
          )
        },
      },
      {
        Header: "Variant",
        Cell: ({ row: { original } }) => {
          return <div>{original?.variants[0]?.title || "-"}</div>
        },
      },
      {
        Header: "SKU",
        accessor: "sku",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Reserved",
        accessor: "reserved_quantity",
        Cell: ({ row: { original } }) => {
          const navigate = useNavigate()

          return (
            <div className="flex grow">
              <Tooltip
                content={
                  <Button
                    size="small"
                    className="inter-small-regular w-full"
                    variant="ghost"
                    onClick={() => {
                      navigate(
                        `/a/inventory/reservations?inventory_item_id%5B0%5D=${original.id}`
                      )
                    }}
                  >
                    Go to reservations
                  </Button>
                }
              >
                <div>
                  {original.location_levels.reduce(
                    (acc: number, next: InventoryLevelDTO) =>
                      acc + next.reserved_quantity,
                    0
                  )}
                </div>
              </Tooltip>
            </div>
          )
        },
      },
      {
        Header: "In stock",
        accessor: "stocked_quantity",
        Cell: ({ row: { original } }) => {
          return (
            <div className="bg-green-20">
              {original.location_levels.reduce(
                (acc: number, next: InventoryLevelDTO) =>
                  acc + next.stocked_quantity,
                0
              )}
            </div>
          )
        },
      },
    ],
    []
  )

  return [columns] as const
}

export default useInventoryTableColumn
