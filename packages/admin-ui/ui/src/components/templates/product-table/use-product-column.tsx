import clsx from "clsx"
import { useAdminStore } from "medusa-react"
import { useMemo } from "react"
import { defaultChannelsSorter } from "../../../utils/sales-channel-compare-operator"
import DelimitedList from "../../molecules/delimited-list"
import ListIcon from "../../fundamentals/icons/list-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"
import { useWindowDimensions } from "../../../hooks/use-window-dimensions"

const useProductTableColumn = ({ setTileView, setListView, showList }) => {
  const getProductStatus = (status) => {
    switch (status) {
      case "proposed":
        return <StatusIndicator title={"Proposed"} variant={"warning"} />
      case "published":
        return <StatusIndicator title={"Published"} variant={"success"} />
      case "rejected":
        return <StatusIndicator title={"Rejected"} variant={"danger"} />
      case "draft":
        return <StatusIndicator title={"Draft"} variant={"default"} />
      default:
        return <StatusIndicator title={status} variant={"default"} />
    }
  }

  const { store } = useAdminStore()

  const getProductSalesChannels = (salesChannels) => {
    const salesChannelsNames = (salesChannels || [])
      .sort(defaultChannelsSorter(store?.default_sales_channel_id || ""))
      .map((sc) => sc.name)

    return <DelimitedList list={salesChannelsNames} />
  }

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex items-center">
              <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                {original.thumbnail ? (
                  <img
                    src={original.thumbnail}
                    className="rounded-soft h-full object-cover"
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
              {original.title_ar}
            </div>
          )
        },
      },
      {
        Header: "Collection",
        accessor: "collection", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value?.title || "-"}</div>
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ cell: { value } }) => getProductStatus(value),
      },
      {
        Header: "Availability",
        accessor: "sales_channels",
        Cell: ({ cell: { value } }) => getProductSalesChannels(value),
      },
      {
        Header: "Inventory",
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div>
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {" in stock for "}
            {value.length} variant(s)
          </div>
        ),
      },
      {
        accessor: "col-3",
        Header: (
          <div className="flex justify-end text-right">
            <span
              onClick={setListView}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": showList,
                "text-grey-40": !showList,
              })}
            >
              <ListIcon size={20} />
            </span>
            <span
              onClick={setTileView}
              className={clsx("hover:bg-grey-5 cursor-pointer rounded p-0.5", {
                "text-grey-90": !showList,
                "text-grey-40": showList,
              })}
            >
              <TileIcon size={20} />
            </span>
          </div>
        ),
      },
    ],
    [showList]
  )

  const mobileColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "title",
        Cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-col gap-10">
              <div className="flex items-center">
                <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
                  {original.thumbnail ? (
                    <img
                      src={original.thumbnail}
                      className="rounded-soft h-full object-cover"
                    />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                {original.title_ar}
              </div>
              <div className="flex flex-row justify-between">
                {getProductStatus(original.status)}
                <div>
                  {original.variants.reduce(
                    (acc, next) => acc + next.inventory_quantity,
                    0
                  )}
                  {" in stock for "}
                  {original.variants.length} variant(s)
                </div>
              </div>
            </div>
          )
        },
      },
    ],
    [showList]
  )
  const { width } = useWindowDimensions()
  if (width > 600) return [columns] as const
  return [mobileColumns] as const
}

export default useProductTableColumn
