import { HttpTypes } from "@medusajs/types";
import { createDataTableColumnHelper, Tooltip } from "@medusajs/ui";
import { useMemo } from "react";
import { DataTableStatusCell } from "../../components/data-table/components/data-table-status-cell/data-table-status-cell";
import { useDataTableDateColumns } from "../../components/data-table/helpers/general/use-data-table-date-columns";

const columnHelper = createDataTableColumnHelper<HttpTypes.AdminSalesChannel>();

export const useSalesChannelTableColumns = () => {
  const dateColumns = useDataTableDateColumns<HttpTypes.AdminSalesChannel>();

  return useMemo(
    () => [
      columnHelper.accessor("name", {
        header: () => "Name",
        enableSorting: true,
        sortLabel: "Name",
        sortAscLabel: "Asc",
        sortDescLabel: "Desc",
      }),
      columnHelper.accessor("description", {
        header: () => "Description",
        cell: ({ getValue }) => {
          return (
            <Tooltip content={getValue()}>
              <div className="flex h-full w-full items-center overflow-hidden">
                <span className="truncate">{getValue()}</span>
              </div>
            </Tooltip>
          );
        },
        enableSorting: true,
        sortLabel: "Description",
        sortAscLabel: "Asc",
        sortDescLabel: "Desc",
        maxSize: 250,
        minSize: 100,
      }),
      columnHelper.accessor("is_disabled", {
        header: () => "Status",
        enableSorting: true,
        sortLabel: "Status",
        sortAscLabel: "Asc",
        sortDescLabel: "Desc",
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <DataTableStatusCell color={value ? "grey" : "green"}>
              {value ? "Disabled" : "Enabled"}
            </DataTableStatusCell>
          );
        },
      }),
      ...dateColumns,
    ],
    [dateColumns]
  );
};
