import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { TaxRateResponse } from "@medusajs/types"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"

import {
  TypeCell,
  TypeHeader,
} from "../../../components/table/table-cells/taxes/type-cell"

const columnHelper = createColumnHelper<TaxRateResponse>()

export const useTaxRateTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.display({
        id: "name",
        header: () => <TextHeader text={t("fields.name")} />,
        cell: ({ row }) => <TextCell text={row.original.name} />,
      }),
      columnHelper.display({
        id: "province",
        header: () => <TextHeader text={t("fields.province")} />,
        cell: ({ row }) => (
          <TextCell text={row.original.tax_region.province_code} />
        ),
      }),
      columnHelper.display({
        id: "rate",
        header: () => <TextHeader text={t("fields.rate")} />,
        cell: ({ row }) => <TextCell text={`${row.original.rate} %`} />,
      }),
      columnHelper.display({
        id: "is_combinable",
        header: () => <TypeHeader text={t("fields.type")} />,
        cell: ({ row }) => (
          <TypeCell is_combinable={row.original.is_combinable} />
        ),
      }),
      columnHelper.display({
        id: "code",
        header: () => <TextHeader text={t("fields.code")} />,
        cell: ({ row }) => <TextCell text={row.original.code || "-"} />,
      }),
    ],
    []
  )
}
