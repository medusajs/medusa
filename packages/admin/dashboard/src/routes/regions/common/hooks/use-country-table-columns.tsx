import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { StaticCountry } from "../../../../lib/data/countries"

const columnHelper = createColumnHelper<StaticCountry>()

export const useCountryTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("display_name", {
        header: t("fields.name"),
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor("iso_2", {
        header: t("fields.code"),
        cell: ({ getValue }) => <span className="uppercase">{getValue()}</span>,
      }),
    ],
    [t]
  )
}
