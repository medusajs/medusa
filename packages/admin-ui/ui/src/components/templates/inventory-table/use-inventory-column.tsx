import { useMemo } from "react"

import ImagePlaceholder from "../../fundamentals/image-placeholder"

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
        Header: "Incoming",
        accessor: "incoming_quantity",
        Cell: ({ row: { original } }) => (
          <div>
            {original.location_levels.reduce(
              (acc, next) => acc + next.incoming_quantity,
              0
            )}
          </div>
        ),
      },
      {
        Header: "In stock",
        accessor: "stocked_quantity",
        Cell: ({ row: { original } }) => (
          <div>
            {original.location_levels.reduce(
              (acc, next) => acc + next.stocked_quantity,
              0
            )}
          </div>
        ),
      },
    ],
    []
  )

  return [columns] as const
}

export default useInventoryTableColumn
