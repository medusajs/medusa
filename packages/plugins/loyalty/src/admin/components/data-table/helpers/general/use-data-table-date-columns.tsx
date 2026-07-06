import {
  createDataTableColumnHelper,
  DataTableColumnDef,
  Tooltip,
} from "@medusajs/ui";
import { useMemo } from "react";
import { useDate } from "../../../../hooks/common/use-date";

type EntityWithDates = {
  created_at: string;
  updated_at: string;
};

const columnHelper = createDataTableColumnHelper<EntityWithDates>();

export const useDataTableDateColumns = <TData extends EntityWithDates>() => {
  const { getFullDate } = useDate();

  return useMemo(() => {
    return [
      columnHelper.accessor("created_at", {
        header: "Created at",
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
          );
        },
        enableSorting: true,
        sortAscLabel: "Asc",
        sortDescLabel: "Desc",
      }),
      columnHelper.accessor("updated_at", {
        header: "Updated at",
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
          );
        },
        enableSorting: true,
        sortAscLabel: "Asc",
        sortDescLabel: "Desc",
      }),
    ] as DataTableColumnDef<TData>[];
  }, [getFullDate]);
};
