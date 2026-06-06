import {
  createDataTableColumnHelper,
  DataTableColumnDef,
  Tooltip,
} from "@zjedene-medusa/ui"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDate } from "../../../../hooks/use-date"

type EntityWithDates = {
  created_at: string
  updated_at: string
}

const columnHelper = createDataTableColumnHelper<EntityWithDates>()

export const useDataTableDateColumns = <TData extends EntityWithDates>() => {
  const { t } = useTranslation()
  const { getFullDate } = useDate()

  return useMemo(() => {
    return [
      columnHelper.accessor("created_at", {
        header: t("fields.createdAt"),
        cell: ({ row }) => {
          return (
            <Tooltip
              content={getFullDate({
                date: row.original.created_at,
                includeTime: true,
              })}
            >
              <span>{getFullDate({ date: row.original.created_at })}</span>
            </Tooltip>
          )
        },
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
      columnHelper.accessor("updated_at", {
        header: t("fields.updatedAt"),
        cell: ({ row }) => {
          return (
            <Tooltip
              content={getFullDate({
                date: row.original.updated_at,
                includeTime: true,
              })}
            >
              <span>{getFullDate({ date: row.original.updated_at })}</span>
            </Tooltip>
          )
        },
        enableSorting: true,
        sortAscLabel: t("filters.sorting.dateAsc"),
        sortDescLabel: t("filters.sorting.dateDesc"),
      }),
    ] as DataTableColumnDef<TData>[]
  }, [t, getFullDate])
}
