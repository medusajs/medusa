import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  DateCell,
  DateHeader,
} from "../../../../../components/table-cells/common/date-cell"
import {
  CustomerCell,
  CustomerHeader,
} from "../../../../../components/table-cells/order/customer-cell"
import {
  DisplayIdCell,
  DisplayIdHeader,
} from "../../../../../components/table-cells/order/display-id-cell"
import {
  FulfillmentStatusCell,
  FulfillmentStatusHeader,
} from "../../../../../components/table-cells/order/fulfillment-status-cell"
import {
  ItemsCell,
  ItemsHeader,
} from "../../../../../components/table-cells/order/items-cell"
import {
  PaymentStatusCell,
  PaymentStatusHeader,
} from "../../../../../components/table-cells/order/payment-status-cell"
import {
  SalesChannelCell,
  SalesChannelHeader,
} from "../../../../../components/table-cells/order/sales-channel-cell"
import {
  TotalCell,
  TotalHeader,
} from "../../../../../components/table-cells/order/total-cell"

// We have to use any here, as the type of Order is so complex that it lags the TS server
const columnHelper = createColumnHelper<any>()

export const useColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_id", {
        header: () => <DisplayIdHeader />,
        cell: ({ getValue }) => {
          const id = getValue()

          return <DisplayIdCell displayId={id} />
        },
      }),
      columnHelper.accessor("created_at", {
        header: () => <DateHeader />,
        cell: ({ getValue }) => {
          const date = new Date(getValue())

          return <DateCell date={date} />
        },
      }),
      columnHelper.accessor("customer", {
        header: () => <CustomerHeader />,
        cell: ({ getValue }) => {
          const customer = getValue()

          return <CustomerCell customer={customer} />
        },
      }),
      columnHelper.accessor("sales_channel", {
        header: () => <SalesChannelHeader />,
        cell: ({ getValue }) => {
          const channel = getValue()

          return <SalesChannelCell channel={channel} />
        },
      }),
      columnHelper.accessor("payment_status", {
        header: () => <PaymentStatusHeader />,
        cell: ({ getValue }) => {
          const status = getValue()

          return <PaymentStatusCell status={status} />
        },
      }),
      columnHelper.accessor("fulfillment_status", {
        header: () => <FulfillmentStatusHeader />,
        cell: ({ getValue }) => {
          const status = getValue()

          return <FulfillmentStatusCell status={status} />
        },
      }),
      columnHelper.accessor("items", {
        header: () => <ItemsHeader />,
        cell: ({ getValue, row }) => {
          const items = getValue()

          return <ItemsCell items={items} />
        },
      }),
      columnHelper.accessor("total", {
        header: () => <TotalHeader />,
        cell: ({ getValue, row }) => {
          const total = getValue()
          const currencyCode = row.original.currency_code

          return <TotalCell currencyCode={currencyCode} total={total} />
        },
      }),
    ],
    [t]
  )
}
