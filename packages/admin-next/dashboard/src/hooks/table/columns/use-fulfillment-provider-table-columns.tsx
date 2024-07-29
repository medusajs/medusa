import { HttpTypes } from "@medusajs/types"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  TextCell,
  TextHeader,
} from "../../../components/table/table-cells/common/text-cell"

const columnHelper = createColumnHelper<HttpTypes.AdminFulfillmentProvider>()

export const useFulfillmentProviderTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("id", {
        header: () => <TextHeader text={"Provider"} />,
        cell: ({ getValue }) => <TextCell text={getValue()} />,
      }),
    ],
    [t]
  )
}
