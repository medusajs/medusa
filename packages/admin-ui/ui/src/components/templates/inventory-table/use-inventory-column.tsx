import Button from "../../fundamentals/button"
import { Column } from "@tanstack/react-table"
import { DecoratedInventoryItemDTO } from "@medusajs/medusa"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import { InventoryLevelDTO } from "@medusajs/types"
import Tooltip from "../../atoms/tooltip"
import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const useInventoryTableColumn = ({
  location_id,
}: {
  location_id: string
}): [Column<DecoratedInventoryItemDTO>[]] => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => [
      {
        Header: t("inventory-table-item", "Item"),
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="my-1.5 me-4 flex h-[40px] w-[30px] items-center">
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
        Header: t("inventory-table-variant", "Variant"),
        Cell: ({ row: { original } }) => {
          return <div>{original?.variants[0]?.title || "-"}</div>
        },
      },
      {
        Header: t("inventory-table-sku", "SKU"),
        accessor: "sku",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: t("inventory-table-reserved", "Reserved"),
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
                        `/a/inventory/reservations?inventory_item_id%5B0%5D=${
                          original.id
                        }${location_id ? `&location_id=${location_id}` : ""}`
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
        Header: t("inventory-table-in-stock", "In stock"),
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
    [location_id]
  )

  return [columns] as const
}

export default useInventoryTableColumn
