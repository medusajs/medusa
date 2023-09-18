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
import { useWindowDimensions } from "../../../hooks/use-window-dimensions"
import i18n from "i18next"
const useProductTableColumn = ({ setTileView, setListView, showList }) => {
  const { t } = useTranslation()
  const getProductStatus = (status) => {
    switch (status) {
      case "proposed":
        return <StatusIndicator title={t("Proposed")} variant={"warning"} />
      case "published":
        return <StatusIndicator title={t("Published")} variant={"success"} />
      case "rejected":
        return <StatusIndicator title={t("Rejected")} variant={"danger"} />
      case "draft":
        return <StatusIndicator title={t("Draft")} variant={"default"} />
      default:
        return <StatusIndicator title={t(status)} variant={"default"} />
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
        Header: t("Name"),
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
              {i18n.language === "ar" ? original.title_ar : original.title}
            </div>
          )
        },
      },
      {
        Header: t("Collection"),
        accessor: "collection", // accessor is the "key" in the data
        Cell: ({ cell: { value } }) => {
          return <div>{value?.title || "-"}</div>
        },
      },
      {
        Header: t("Status"),
        accessor: "status",
        Cell: ({ cell: { value } }) => getProductStatus(value),
      },
      {
        Header: t("Availability"),
        accessor: "sales_channels",
        Cell: ({ cell: { value } }) => getProductSalesChannels(value),
      },
      {
        Header: t("Inventory"),
        accessor: "variants",
        Cell: ({ cell: { value } }) => (
          <div dir ="auto" >
            {value.reduce((acc, next) => acc + next.inventory_quantity, 0)}
            {t("in stock for {count} variant(s)", { count: value.length })}
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
                {i18n.language === "ar" ? original.title_ar : original.title}
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
