import { PromotionDTO } from "@medusajs/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import {
  CodeCell,
  CodeHeader,
} from "../../../components/table/table-cells/common/code-cell"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"
import { StatusCell } from "../../../components/table/table-cells/promotion/status-cell"

const columnHelper = createColumnHelper<PromotionDTO>()

export const usePromotionTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "code",
        header: () => <CodeHeader text={t("fields.code")} />,
        cell: ({ row }) => <CodeCell code={row.original.code!} />,
      }),

      columnHelper.display({
        id: "campaign",
        header: () => <TextHeader text={t("promotions.fields.campaign")} />,
        cell: ({ row }) => <TextCell text={row.original.campaign?.name} />,
      }),

      columnHelper.display({
        id: "method",
        header: () => <TextHeader text={t("promotions.fields.method")} />,
        cell: ({ row }) => {
          const text = row.original.is_automatic
            ? "Automatic"
            : "Promotion Code"

          return <TextCell text={text} />
        },
      }),

      columnHelper.display({
        id: "status",
        header: () => <TextHeader text={t("fields.status")} />,
        cell: ({ row }) => <StatusCell promotion={row.original} />,
      }),
    ],
    []
  ) as ColumnDef<PromotionDTO>[]
}
