import moment from "moment"
import { useMemo } from "react"
import ReactCountryFlag from "react-country-flag"
import { getColor } from "../../../utils/color"
import { isoAlpha2Countries } from "../../../utils/countries"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import StatusDot from "../../fundamentals/status-indicator"
import CustomerAvatarItem from "../../molecules/customer-avatar-item"

const useOrderTableColums = () => {
  const decideStatus = (status) => {
    switch (status) {
      case "captured":
        return <StatusDot variant="success" title={"Paid"} />
      case "awaiting":
        return <StatusDot variant="default" title={"Awaiting"} />
      case "requires_action":
        return <StatusDot variant="danger" title={"Requires action"} />
      case "canceled":
        return <StatusDot variant="warning" title={"Canceled"} />
      default:
        return <StatusDot variant="primary" title={"N/A"} />
    }
  }

  const columns = useMemo(
    () => [
      {
        Header: <div className="pl-2">Order</div>,
        accessor: "display_id",
        Cell: ({ cell: { value } }) => (
          <p className="text-grey-90 group-hover:text-violet-60 min-w-[100px] pl-2">{`#${value}`}</p>
        ),
      },
      {
        Header: "Date added",
        accessor: "created_at",
        Cell: ({ cell: { value } }) => (
          <div>
            <Tooltip content={moment(value).format("DD MMM YYYY hh:mm a")}>
              {moment(value).format("DD MMM YYYY")}
            </Tooltip>
          </div>
        ),
      },
      {
        Header: "Customer",
        accessor: "customer",
        Cell: ({ row, cell: { value } }) => (
          <div>
            <CustomerAvatarItem
              customer={{
                first_name:
                  value?.first_name ||
                  row.original.shipping_address?.first_name,
                last_name:
                  value?.last_name || row.original.shipping_address?.last_name,
                email: row.original.email,
              }}
              color={getColor(row.index)}
            />
          </div>
        ),
      },
      {
        Header: "Fulfillment",
        accessor: "fulfillment_status",
        Cell: ({ cell: { value } }) => value,
      },
      {
        Header: "Payment status",
        accessor: "payment_status",
        Cell: ({ cell: { value } }) => decideStatus(value),
      },
      {
        Header: "Sales Channel",
        accessor: "sales_channel",
        Cell: ({ cell: { value } }) => value?.name ?? "N/A",
      },
      {
        Header: () => <div className="text-right">Total</div>,
        accessor: "total",
        Cell: ({ row, cell: { value } }) => (
          <div className="text-right">
            {formatAmountWithSymbol({
              amount: value,
              currency: row.original.currency_code,
              digits: 2,
            })}
          </div>
        ),
      },
      {
        Header: "",
        accessor: "currency_code",
        Cell: ({ cell: { value } }) => (
          <div className="text-right text-grey-40">{value.toUpperCase()}</div>
        ),
      },
      {
        Header: "",
        accessor: "country_code",
        Cell: ({ row }) => (
          <div className="pr-2">
            <div className="flex rounded-rounded w-full justify-end">
              <Tooltip
                content={
                  isoAlpha2Countries[
                    row.original.shipping_address?.country_code?.toUpperCase()
                  ] ||
                  row.original.shipping_address?.country_code?.toUpperCase()
                }
              >
                <ReactCountryFlag
                  className={"rounded"}
                  svg
                  countryCode={row.original.shipping_address?.country_code}
                />
              </Tooltip>
            </div>
          </div>
        ),
      },
    ],
    []
  )

  return [columns]
}

export default useOrderTableColums
