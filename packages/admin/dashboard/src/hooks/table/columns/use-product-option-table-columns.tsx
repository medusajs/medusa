import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TextCell } from "../../../components/table/table-cells/common/text-cell"
import { HttpTypes } from "@medusajs/types"
import { Badge } from "@medusajs/ui"

const columnHelper = createColumnHelper<HttpTypes.AdminProductOption>()

export const useProductOptionTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("values", {
        header: t("fields.values"),
        cell: ({ getValue }) => {
          const values = getValue()
          const count = values?.length || 0
          const displayText =
            count > 0
              ? t(`general.${count === 1 ? "values_one" : "values_other"}`, {
                  count,
                })
              : "-"

          return <TextCell text={displayText} />
        },
      }),
      columnHelper.accessor("is_exclusive", {
        header: t("fields.status"),
        cell: ({ getValue }) => {
          const isExclusive = getValue()
          return (
            <Badge size="xsmall" color={isExclusive ? "grey" : "blue"}>
              {t(`general.${isExclusive ? "exclusive" : "global"}`)}
            </Badge>
          )
        },
      }),
    ],
    [t]
  )
}
