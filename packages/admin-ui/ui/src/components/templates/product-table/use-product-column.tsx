import clsx from "clsx"
import { useAdminStore } from "medusa-react"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { defaultChannelsSorter } from "../../../utils/sales-channel-compare-operator"
import DelimitedList from "../../molecules/delimited-list"
import ListIcon from "../../fundamentals/icons/list-icon"
import TileIcon from "../../fundamentals/icons/tile-icon"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"

const useProductTableColumn = ({ setTileView, setListView, showList }) => {
  const { t } = useTranslation()

  const getProductStatus = (status) => {
    switch (status) {
      case "proposed":
        return (
          <StatusIndicator
            title={t("product-table-proposed", "Proposed")}
            variant={"warning"}
          />
        )
      case "published":
        return (
          <StatusIndicator
            title={t("product-table-published-title", "Published")}
            variant={"success"}
          />
        )
      case "rejected":
        return (
          <StatusIndicator
            title={t("product-table-rejected", "Rejected")}
            variant={"danger"}
          />
        )
      case "draft":
        return (
          <StatusIndicator
            title={t("product-table-draft-title", "Draft")}
            variant={"default"}
          />
        )
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
        Header: t("product-table-name", "Name"),
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
              {original.title}
            </div>
          )
        },
      },
      {
        Header: t("product-table-collection", "Collection"),
        accessor: "collection", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value?.title || "-"}</div>
        },
      },
      {
        Header: t("product-table-status", "Status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => getProductStatus(value),
      },
      {
        Header: t("product-table-availability", "Availability"),
        accessor: "sales_channels",
        Cell: ({ cell: { value } }) => getProductSalesChannels(value),
      },
      {
        Header: t("product-table-inventory", "Inventory"),
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div>
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {t(
              "product-table-inventory-in-stock-count",
              " in stock for {{count}} variant(s)",
              { count: value.length }
            )}
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

  return [columns] as const
}

export default useProductTableColumn
