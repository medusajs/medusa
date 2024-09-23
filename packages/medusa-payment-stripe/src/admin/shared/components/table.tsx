import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import moment from "moment"
import Badge from "./badge"
import StatusIndicator from "./dot"
import { formatAmount } from "medusa-react"
import { WidgetPayment } from "../../../types"
import LinkIcon from "../icons/link"

const STRIPE_DASHBOARD_URL = "https://dashboard.stripe.com"

type Props = {
  payments: WidgetPayment[]
}

const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const riskScoreToStatusMapper = (riskScore: number | null) => {
  if (!riskScore) {
    return "default"
  }
  switch (true) {
    case riskScore <= 15:
      return "success"
    case 15 < riskScore && riskScore <= 75:
      return "warning"
    case 75 < riskScore:
      return "danger"
    default:
      return "default"
  }
}

const columns: ColumnDef<WidgetPayment>[] = [
  {
    id: "intent",
    header: () => <div className="flex items-center text-left">Intent</div>,
    accessorFn: (row) => row.id,
    cell: ({ row }) => {
      return (
        <div className="text-violet-60 flex">
          <a
            className="max-w-[100px] truncate text-blue-500"
            href={`${STRIPE_DASHBOARD_URL}/payments/${row.original.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {row.original.id}
          </a>
          <LinkIcon />
        </div>
      )
    },
  },
  {
    id: "payment",
    header: () => <div className="flex items-center text-right">Payment</div>,
    accessorFn: (row) => row.amount,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-1 ">
          <p className="text-gray-900">
            {formatAmount({
              amount: row.original.amount,
              region: row.original.region,
              includeTaxes: false
            })}{" "}
          </p>
        </div>
      )
    },
  },
  {
    id: "created",
    header: () => <div className=" flex items-center">Created</div>,
    accessorFn: (row) => row.created,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-1 ">
          {moment(new Date(row.original.created * 1000)).format("MMM D, YYYY")}
        </div>
      )
    },
  },
  {
    id: "payment_type",
    header: () => <div className=" flex items-center">Payment Type</div>,
    accessorFn: (row) => row.created,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-y-1 ">
          <p className="text-gray-900">{capitalize(row.original.type)}</p>
        </div>
      )
    },
  },
  {
    id: "fraud_score",
    header: () => <div className="flex items-center">Risk Evaluation</div>,
    accessorFn: (row) => row.risk_score,
    cell: ({ row }) => {
      const riskLevel = row.original.risk_level
      const riskScore = row.original.risk_score

      return (
        <div className="flex flex-col gap-y-1">
          {!row.original.risk_level ? (
            "N/A"
          ) : (
            <Badge>
              <StatusIndicator
                title={`${capitalize(riskLevel)} - ${riskScore}`}
                variant={riskScoreToStatusMapper(riskScore)}
              />
            </Badge>
          )}
        </div>
      )
    },
  },
]

const Table = ({ payments }: Props) => {
  const table = useReactTable({
    data: payments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className="w-full">
      <thead className="border-y border-gray-200">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="py-4 text-[12px] font-semibold text-gray-500 first:pl-8 last:pr-8"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-b border-gray-200">
            {row.getVisibleCells().map((cell) => (
              <td
                key={cell.id}
                className="py-4 text-[12px] leading-5 first:pl-8 last:pr-8"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
