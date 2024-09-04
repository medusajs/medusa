import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { TextCell } from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminCollection>()

export const useCollectionTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("title", {
        header: t("fields.title"),
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
      columnHelper.accessor("handle", {
        header: t("fields.handle"),
        cell: ({ getValue }) => <TextCell text={`/${getValue()}`} />,
      }),
      columnHelper.accessor("products", {
        header: t("fields.products"),
        cell: ({ getValue }) => {
          const count = getValue()?.length || undefined

          return <TextCell text={count} />
        },
      }),
    ],
    [t]
  )
}
