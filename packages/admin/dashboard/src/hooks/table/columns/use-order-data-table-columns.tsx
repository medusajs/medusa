import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  DateCell,
  DateHeader,
} from "../../../components/table/table-cells/common/date-cell"
import { CountryCell } from "../../../components/table/table-cells/order/country-cell"
import {
  CustomerCell,
  CustomerHeader,
} from "../../../components/table/table-cells/order/customer-cell"
import {
  DisplayIdCell,
  DisplayIdHeader,
} from "../../../components/table/table-cells/order/display-id-cell"
import {
  FulfillmentStatusCell,
  FulfillmentStatusHeader,
} from "../../../components/table/table-cells/order/fulfillment-status-cell"
import {
  PaymentStatusCell,
  PaymentStatusHeader,
} from "../../../components/table/table-cells/order/payment-status-cell"
import {
  SalesChannelCell,
  SalesChannelHeader,
} from "../../../components/table/table-cells/order/sales-channel-cell"
import {
  TotalCell,
  TotalHeader,
} from "../../../components/table/table-cells/order/total-cell"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminOrder>()

/**
 * Hook to build columns dynamically based on API columns response
 */
export const useOrderDataTableColumns = (
  apiColumns: HttpTypes.AdminColumn[] | undefined,
  visibleColumns: string[]
) => {
  const { t } = useTranslation()

  return useMemo(() => {
    if (!apiColumns || apiColumns.length === 0) {
      // Return default columns if no API columns
      return [
        columnHelper.accessor("display_id", {
          header: () => <DisplayIdHeader />,
          cell: ({ getValue }) => {
            const id = getValue()
            return <DisplayIdCell displayId={id!} />
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
        columnHelper.accessor("total", {
          header: () => <TotalHeader />,
          cell: ({ getValue, row }) => {
            const total = getValue()
            const currencyCode = row.original.currency_code
            return <TotalCell currencyCode={currencyCode} total={total} />
          },
        }),
        columnHelper.display({
          id: "country",
          cell: ({ row }) => {
            const country = row.original.shipping_address?.country
            return <CountryCell country={country} />
          },
        }),
      ]
    }

    // Build columns from API response
    return apiColumns
      .filter((col) => visibleColumns.includes(col.id))
      .sort((a, b) => {
        const aIndex = visibleColumns.indexOf(a.id)
        const bIndex = visibleColumns.indexOf(b.id)
        return aIndex - bIndex
      })
      .map((col) => {
        // Handle special columns with custom cells
        switch (col.id) {
          case "display_id":
            return columnHelper.accessor("display_id", {
              header: () => <DisplayIdHeader />,
              cell: ({ getValue }) => {
                const id = getValue()
                return <DisplayIdCell displayId={id!} />
              },
            })

          case "created_at":
          case "updated_at":
            return columnHelper.accessor(col.field as any, {
              header: () => <DateHeader />,
              cell: ({ getValue }) => {
                const date = getValue() ? new Date(getValue() as string) : null
                return date ? <DateCell date={date} /> : null
              },
            })

          case "email":
            return columnHelper.accessor("email", {
              header: () => <TextHeader text={col.name} />,
              cell: ({ getValue }) => {
                const email = getValue()
                return <TextCell text={email || ""} />
              },
            })

          case "customer_display":
            return columnHelper.accessor("customer", {
              header: () => <CustomerHeader />,
              cell: ({ getValue }) => {
                const customer = getValue()
                return <CustomerCell customer={customer} />
              },
            })

          case "sales_channel.name":
            return columnHelper.accessor("sales_channel", {
              header: () => <SalesChannelHeader />,
              cell: ({ getValue }) => {
                const channel = getValue()
                return <SalesChannelCell channel={channel} />
              },
            })

          case "payment_status":
            return columnHelper.accessor("payment_status", {
              header: () => <PaymentStatusHeader />,
              cell: ({ getValue }) => {
                const status = getValue()
                return <PaymentStatusCell status={status} />
              },
            })

          case "fulfillment_status":
            return columnHelper.accessor("fulfillment_status", {
              header: () => <FulfillmentStatusHeader />,
              cell: ({ getValue }) => {
                const status = getValue()
                return <FulfillmentStatusCell status={status} />
              },
            })

          case "total":
            return columnHelper.accessor("total", {
              header: () => <TotalHeader />,
              cell: ({ getValue, row }) => {
                const total = getValue()
                const currencyCode = row.original.currency_code
                return <TotalCell currencyCode={currencyCode} total={total} />
              },
            })

          case "country":
            return columnHelper.display({
              id: "country",
              cell: ({ row }) => {
                const country = row.original.shipping_address?.country
                return <CountryCell country={country} />
              },
            })

          default:
            // Handle relationship fields (e.g., customer.email)
            if (col.field.includes(".")) {
              const [relation, field] = col.field.split(".")
              return columnHelper.accessor(
                (row: any) => {
                  const relationData = row[relation]
                  return relationData?.[field] || ""
                },
                {
                  id: col.id,
                  header: () => <TextHeader text={col.name} />,
                  cell: ({ getValue }) => {
                    const value = getValue()
                    return <TextCell text={value || ""} />
                  },
                }
              )
            }

            // Default text column
            return columnHelper.accessor(col.field as any, {
              header: () => <TextHeader text={col.name} />,
              cell: ({ getValue }) => {
                const value = getValue()
                return <TextCell text={value || ""} />
              },
            })
        }
      })
  }, [apiColumns, visibleColumns, t])
}
